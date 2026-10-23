"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AuiIf,
  AssistantRuntimeProvider,
  ThreadPrimitive,
  useExternalStoreRuntime,
  type AppendMessage,
  type MessageState,
  type ThreadSuggestion,
} from "@assistant-ui/react";
import { Database, MessageSquarePlus, Sparkles } from "lucide-react";
import { matchAnswer } from "@/lib/assistant-rules";
import { suggestedQuestions } from "@/lib/project-data";
import {
  appendUserMessage,
  artifactFromAnswer,
  completeRun,
  createConversation,
  startRun,
  toThreadMessage,
  useActiveConversation,
  useExplorer,
  type ChatMessage,
} from "@/lib/explorer-store";
import { ChatContext, type ChatContextValue } from "./chat-context";
import {
  AssistantRow,
  PendingRow,
  UserRow,
  createDraftFromAnswer,
  saveAnswerToResults,
} from "./message-rows";
import { ComposerBar, StarterSuggestion } from "./composer-bar";

/** Perguntas extras oferecidas quando a conversa ainda está vazia. */
const extraPrompts = [
  "Como a receita de setembro evoluiu em relação a agosto?",
  "Me mostre um gráfico de receita por região",
];

/** Sugestões do runtime: as duas da UI + as extras do estado vazio. */
const suggestions: ThreadSuggestion[] = [
  ...suggestedQuestions.map((title) => ({
    title,
    prompt: title.replace(" ↗", ""),
  })),
  ...extraPrompts.map((prompt) => ({ title: prompt, prompt })),
];

function extractText(message: AppendMessage): string {
  if (typeof message.content === "string") return message.content;
  return message.content
    .filter(
      (part): part is { type: "text"; text: string } =>
        part.type === "text" && typeof part.text === "string",
    )
    .map((part) => part.text)
    .join("\n");
}

type ChatPanelProps = {
  projectId: string;
  selectedIds: string[];
  onToggleSource: (id: string) => void;
};

/**
 * Conversa com o assistente: runtime externo sobre o store de conversas,
 * mensagens próprias e composer com sugestões.
 */
export function ChatPanel({
  projectId,
  selectedIds,
  onToggleSource,
}: ChatPanelProps) {
  const conversation = useActiveConversation();
  const { pendingIds } = useExplorer();
  const pending = pendingIds.includes(conversation.id);
  const isEmpty = conversation.messages.length === 0;

  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [creatingIds, setCreatingIds] = useState<string[]>([]);
  const [createdIds, setCreatedIds] = useState<string[]>([]);

  const sourcesRef = useRef(selectedIds);
  useEffect(() => {
    sourcesRef.current = selectedIds;
  }, [selectedIds]);

  const onNew = useCallback(
    (message: AppendMessage): Promise<void> => {
      const text = extractText(message).trim();
      if (text.length === 0) return Promise.resolve();

      const conversationId = conversation.id;
      appendUserMessage(conversationId, text);
      startRun(conversationId);

      const sourceCount = sourcesRef.current.length;
      // Resposta simulada: tempo fixo apenas em handler.
      setTimeout(() => {
        const answerContent = matchAnswer(text);
        const artifact = artifactFromAnswer(answerContent, sourceCount);
        completeRun(conversationId, answerContent, artifact);
      }, 900);

      return Promise.resolve();
    },
    [conversation.id],
  );

  const runtime = useExternalStoreRuntime<ChatMessage>({
    messages: conversation.messages,
    convertMessage: toThreadMessage,
    isRunning: pending,
    isSendDisabled: pending,
    suggestions,
    onNew,
  });

  const renderMessage = useCallback(({ message }: { message: MessageState }) => {
    if (message.role === "user") return <UserRow message={message} />;
    return <AssistantRow message={message} />;
  }, []);

  const contextValue = useMemo<ChatContextValue>(
    () => ({
      projectId,
      pending,
      selectedIds,
      onToggleSource,
      votes,
      savedIds,
      creatingIds,
      createdIds,
      onVote: (messageId, vote) =>
        setVotes((prev) => {
          const next = { ...prev };
          if (next[messageId] === vote) delete next[messageId];
          else next[messageId] = vote;
          return next;
        }),
      onSaveResults: (messageId, answer) => {
        saveAnswerToResults(answer);
        setSavedIds((prev) =>
          prev.includes(messageId) ? prev : [...prev, messageId],
        );
      },
      onCreateAnalysis: (messageId, answer) => {
        setCreatingIds((prev) =>
          prev.includes(messageId) ? prev : [...prev, messageId],
        );
        // Criação simulada (tempo fixo apenas em handler).
        setTimeout(() => {
          createDraftFromAnswer(projectId, answer);
          setCreatingIds((prev) => prev.filter((id) => id !== messageId));
          setCreatedIds((prev) =>
            prev.includes(messageId) ? prev : [...prev, messageId],
          );
        }, 900);
      },
    }),
    [
      projectId,
      pending,
      selectedIds,
      onToggleSource,
      votes,
      savedIds,
      creatingIds,
      createdIds,
    ],
  );

  return (
    <ChatContext.Provider value={contextValue}>
      <AssistantRuntimeProvider runtime={runtime}>
        <div className="flex h-14 w-full shrink-0 items-center gap-[10px] border-b border-line px-5">
          <Sparkles size={18} aria-hidden="true" className="text-brand" />
          <p className="text-base leading-[1.5] text-ink">Análise com IA</p>
          <div className="flex min-w-0 flex-1 items-center justify-end">
            <button
              type="button"
              onClick={() => createConversation()}
              className="flex items-center gap-1 whitespace-pre text-xs leading-[1.5] text-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <MessageSquarePlus size={13} aria-hidden="true" />
              Nova conversa
            </button>
          </div>
        </div>

        <ThreadPrimitive.Root className="flex min-h-0 w-full flex-1 flex-col">
          <ThreadPrimitive.Viewport className="flex w-full min-h-0 flex-1 flex-col items-start gap-[18px] overflow-y-auto p-6">
            <div className="flex w-full shrink-0 items-center gap-[7px]">
              <Database size={14} aria-hidden="true" className="text-muted" />
              <p className="whitespace-nowrap text-xs leading-[1.5] text-muted">
                {selectedIds.length} fontes conectadas · Análise comercial
              </p>
            </div>

            <AuiIf condition={(state) => state.thread.isEmpty}>
              <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border-default px-6 py-10 text-center">
                <Sparkles size={24} aria-hidden="true" className="text-muted" />
                <p className="text-sm font-semibold leading-[1.5] text-ink">
                  Nova conversa iniciada
                </p>
                <p className="max-w-[360px] text-xs leading-[1.5] text-muted">
                  Pergunte sobre receita, regiões, metas ou segmentos. As
                  respostas são simuladas com dados fictícios deste protótipo.
                </p>
                <div className="mt-3 flex w-full flex-col items-stretch gap-2">
                  <ThreadPrimitive.Suggestions
                    components={{ Suggestion: StarterSuggestion }}
                  />
                </div>
              </div>
            </AuiIf>

            <ThreadPrimitive.Messages>{renderMessage}</ThreadPrimitive.Messages>

            {pending && <PendingRow sourceCount={selectedIds.length} />}
          </ThreadPrimitive.Viewport>

          <ComposerBar
            selectedIds={selectedIds}
            onToggleSource={onToggleSource}
            showSuggestions={!pending}
            starter={isEmpty}
          />
        </ThreadPrimitive.Root>
      </AssistantRuntimeProvider>
    </ChatContext.Provider>
  );
}
