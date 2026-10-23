"use client";

import {
  ActionBarPrimitive,
  MessagePrimitive,
  useAuiState,
  type MessageState,
} from "@assistant-ui/react";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import {
  ArrowUpRight,
  BookmarkPlus,
  ChartNoAxesCombined,
  Check,
  Copy,
  FileText,
  Lightbulb,
  Sparkles,
  Table2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { renderRichText, type AnswerContent } from "@/lib/assistant-rules";
import { addAnalysis } from "@/lib/analyses-store";
import { saveResult } from "@/lib/results-store";
import {
  focusArtifact,
  useExplorer,
  type Artifact,
  type ArtifactKind,
  type MessageCustom,
} from "@/lib/explorer-store";
import { useChatContext } from "./chat-context";

const actionButton =
  "flex size-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle-bg hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const kindIcon: Record<ArtifactKind, typeof ChartNoAxesCombined> = {
  grafico: ChartNoAxesCombined,
  tabela: Table2,
  resumo: FileText,
};

function messageText(message: MessageState): string {
  const parts = message.content as readonly { type: string; text?: string }[];
  return parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text as string)
    .join("\n");
}

function customOf(message: MessageState): MessageCustom {
  return (message.metadata?.custom ?? {}) as MessageCustom;
}

export function UserRow({ message }: { message: MessageState }) {
  const custom = customOf(message);
  return (
    <MessagePrimitive.Root className="flex w-full shrink-0 flex-col items-start gap-[6px] rounded-lg bg-selection p-4 leading-[1.5]">
      <p className="whitespace-nowrap text-[11px] font-semibold text-brand">
        VOCÊ · {custom.time}
      </p>
      <p className="w-full text-sm font-medium text-ink">
        {messageText(message)}
      </p>
    </MessagePrimitive.Root>
  );
}

function AnswerBody({ answer }: { answer: AnswerContent }) {
  return (
    <>
      {answer.intro.map((paragraph, index) => (
        <p key={index} className="w-full text-sm leading-[1.65] text-ink">
          {renderRichText(paragraph)}
        </p>
      ))}

      {answer.bullets.length > 0 && (
        <div className="flex w-full flex-col items-start gap-[9px] text-[13px]">
          {answer.bullets.map((bullet) => (
            <div key={bullet} className="flex w-full items-start gap-[10px]">
              <p className="shrink-0 leading-[1.5] text-brand">•</p>
              <p className="min-w-0 flex-1 leading-[1.6] text-ink">{bullet}</p>
            </div>
          ))}
        </div>
      )}

      {answer.tip && (
        <div className="flex w-full items-start gap-[9px] rounded-lg bg-subtle-bg p-3">
          <Lightbulb size={16} aria-hidden="true" className="mt-px shrink-0 text-brand" />
          <p className="min-w-0 flex-1 text-xs leading-[1.5] text-ink">
            {renderRichText(answer.tip)}
          </p>
        </div>
      )}

      {answer.sources.length > 0 && (
        <div className="flex w-full flex-wrap content-start items-start gap-[7px]">
          {answer.sources.map((source) => (
            <Chip
              key={source}
              size="small"
              label={source}
              sx={{
                bgcolor: "var(--color-selection)",
                color: "var(--color-brand)",
                borderRadius: "6px",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

function ArtifactLink({ artifact }: { artifact: Artifact }) {
  const Icon = kindIcon[artifact.kind];
  return (
    <button
      type="button"
      onClick={() => focusArtifact(artifact.id)}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-info-border hover:bg-subtle-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-selection">
        <Icon size={17} aria-hidden="true" className="text-brand" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="truncate text-xs font-semibold leading-[1.5] text-ink">
          {artifact.title}
        </span>
        <span className="truncate text-[11px] leading-[1.5] text-muted">
          {artifact.meta}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold leading-[1.5] text-brand">
        Abrir na área de trabalho
        <ArrowUpRight size={14} aria-hidden="true" />
      </span>
    </button>
  );
}

export function AssistantRow({ message }: { message: MessageState }) {
  const chat = useChatContext();
  const { artifacts } = useExplorer();
  const custom = customOf(message);
  const answer = custom.answer;
  const artifact = custom.artifactId
    ? artifacts.find((item) => item.id === custom.artifactId)
    : undefined;
  const vote = chat.votes[message.id];
  const saved = chat.savedIds.includes(message.id);
  const creating = chat.creatingIds.includes(message.id);
  const created = chat.createdIds.includes(message.id);
  const isCopied = useAuiState((state) => state.message.isCopied);

  return (
    <MessagePrimitive.Root className="flex w-full shrink-0 flex-col items-start gap-[14px]">
      <div className="flex w-full items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand">
          <Sparkles size={16} aria-hidden="true" className="text-white" />
        </span>
        <p className="whitespace-nowrap text-[13px] leading-[1.5] text-ink">
          SIGDATA IA
        </p>
        <p className="whitespace-nowrap text-[11px] leading-[1.5] text-muted">
          {custom.time}
        </p>
      </div>

      {answer ? (
        <AnswerBody answer={answer} />
      ) : (
        <p className="w-full whitespace-pre-wrap text-sm leading-[1.65] text-ink">
          {messageText(message)}
        </p>
      )}

      {artifact && <ArtifactLink artifact={artifact} />}

      <div className="flex w-full flex-wrap items-center gap-2">
        <Tooltip title={isCopied ? "Copiado" : "Copiar resposta"}>
          <span className="flex">
            <ActionBarPrimitive.Copy
              className={actionButton}
              aria-label="Copiar resposta"
            >
              {isCopied ? (
                <Check size={15} aria-hidden="true" />
              ) : (
                <Copy size={15} aria-hidden="true" />
              )}
            </ActionBarPrimitive.Copy>
          </span>
        </Tooltip>

        <Tooltip title="Gostei">
          <button
            type="button"
            onClick={() => chat.onVote(message.id, "up")}
            aria-pressed={vote === "up"}
            aria-label="Gostei da resposta"
            className={`${actionButton} ${vote === "up" ? "bg-selection text-brand" : ""}`}
          >
            <ThumbsUp size={15} aria-hidden="true" />
          </button>
        </Tooltip>

        <Tooltip title="Não gostei">
          <button
            type="button"
            onClick={() => chat.onVote(message.id, "down")}
            aria-pressed={vote === "down"}
            aria-label="Não gostei da resposta"
            className={`${actionButton} ${vote === "down" ? "bg-selection text-brand" : ""}`}
          >
            <ThumbsDown size={15} aria-hidden="true" />
          </button>
        </Tooltip>

        <Tooltip title="Salvar nos resultados">
          <button
            type="button"
            onClick={() => answer && chat.onSaveResults(message.id, answer)}
            aria-label="Salvar nos resultados"
            className={`${actionButton} ${saved ? "bg-selection text-brand" : ""}`}
          >
            <BookmarkPlus size={15} aria-hidden="true" />
          </button>
        </Tooltip>

        {saved && (
          <span className="flex items-center gap-1 text-xs leading-[1.5] text-success">
            <Check size={13} aria-hidden="true" />
            Salvo nos resultados
          </span>
        )}

        {answer?.analysisTitle && !created && (
          <button
            type="button"
            onClick={() => chat.onCreateAnalysis(message.id, answer)}
            disabled={creating}
            className="rounded-lg border border-info-border px-2.5 py-1.5 text-[11px] font-semibold leading-[1.5] text-brand transition-colors hover:bg-selection disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {creating ? "Criando análise…" : "Criar análise em rascunho"}
          </button>
        )}

        {answer?.analysisTitle && created && (
          <span className="flex items-center gap-1.5 text-[11px] leading-[1.5] text-success">
            <Check size={13} aria-hidden="true" />
            Rascunho criado — veja a aba Análises
          </span>
        )}
      </div>
    </MessagePrimitive.Root>
  );
}

export function PendingRow({ sourceCount }: { sourceCount: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex w-full shrink-0 items-center gap-2"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand">
        <Sparkles size={16} aria-hidden="true" className="text-white" />
      </span>
      <p className="text-[13px] leading-[1.5] text-muted">
        Analisando {sourceCount}{" "}
        {sourceCount === 1 ? "fonte selecionada" : "fontes selecionadas"}
        <span className="ml-1 inline-flex gap-0.5">
          <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
        </span>
      </p>
    </div>
  );
}

/** Reproduz as ações de "criar análise" fora do corpo da mensagem. */
export function createDraftFromAnswer(
  projectId: string,
  answer: AnswerContent,
): void {
  addAnalysis({
    projectId,
    title: answer.analysisTitle ?? "Análise gerada pelo assistente",
    type: answer.chart ? "grafico" : "tabela",
    dataset: "Vendas 2026",
    dimensionId: "regiao",
    metricId: "receita",
  });
}

/** Salva a resposta nos resultados do projeto (seção "Salvos pelo assistente"). */
export function saveAnswerToResults(answer: AnswerContent): void {
  saveResult(
    answer.analysisTitle ??
      `${answer.intro[0].slice(0, 64).replace(/\*\*/g, "")}…`,
  );
}
