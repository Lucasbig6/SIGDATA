"use client";

import { useEffect, useRef, useState } from "react";
import MuiButton from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  ArrowUp,
  BookmarkPlus,
  Check,
  Copy,
  Database,
  Lightbulb,
  MessageSquarePlus,
  Paperclip,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  assistantDefaultAnswer,
  matchAnswer,
  renderRichText,
  type AnswerContent,
} from "@/lib/assistant-rules";
import { addAnalysis } from "@/lib/analyses-store";
import { saveResult } from "@/lib/results-store";
import {
  initialUserQuestion,
  suggestedQuestions,
} from "@/lib/project-data";

type ChatEntry =
  | { kind: "user"; id: string; time: string; text: string }
  | { kind: "assistant"; id: string; time: string; answer: AnswerContent };

function initialConversation(): ChatEntry[] {
  return [
    {
      kind: "user",
      id: "user-initial",
      time: initialUserQuestion.time,
      text: initialUserQuestion.text,
    },
    {
      kind: "assistant",
      id: "assistant-initial",
      time: initialUserQuestion.time,
      answer: assistantDefaultAnswer,
    },
  ];
}

function currentTime(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Ids determinísticos por sessão (sem funções impuras no corpo do handler). */
let messageCounter = 0;
function nextId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

function AnswerBody({
  entry,
  projectId,
  saved,
  onSave,
}: {
  entry: Extract<ChatEntry, { kind: "assistant" }>;
  projectId?: string;
  saved: boolean;
  onSave: () => void;
}) {
  const { answer } = entry;
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const max = answer.chart
    ? Math.max(...answer.chart.map((item) => item.value))
    : 1;

  function handleCreateAnalysis() {
    setCreating(true);
    // Criação simulada (tempo fixo apenas em handler).
    setTimeout(() => {
      if (projectId) {
        addAnalysis({
          projectId,
          title: answer.analysisTitle ?? "Análise gerada pelo assistente",
          type: "grafico",
          dataset: "Vendas 2026",
          dimensionId: "regiao",
          metricId: "receita",
        });
      }
      setCreating(false);
      setCreated(true);
    }, 900);
  }

  return (
    <div className="flex w-full flex-col items-start gap-[14px]">
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

      {/* Prévia gerada sob demanda (atualiza a área de resultados) */}
      {answer.chart && (
        <div className="flex w-full flex-col gap-3 rounded-xl border border-border-default p-3">
          <p className="text-xs font-semibold leading-[1.5] text-ink">
            {answer.chartTitle}
          </p>
          {answer.chart.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <p className="w-[92px] shrink-0 truncate text-[11px] leading-[1.5] text-ink">
                {item.label}
              </p>
              <div className="h-3 min-w-0 flex-1 rounded bg-subtle-bg">
                <div
                  className="h-3 rounded bg-gradient-to-r from-brand to-brand-accent"
                  style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {answer.analysisTitle && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              {created ? (
                <p className="flex items-center gap-1.5 text-[11px] leading-[1.5] text-success">
                  <Check size={13} aria-hidden="true" />
                  Rascunho criado — veja a aba Análises
                </p>
              ) : (
                <span className="text-[11px] leading-[1.5] text-muted">
                  Dados fictícios, prévia ilustrativa
                </span>
              )}
              {!created && (
                <MuiButton
                  variant="outlined"
                  color="primary"
                  size="small"
                  disabled={creating}
                  onClick={handleCreateAnalysis}
                  sx={{ textTransform: "none", fontSize: "0.6875rem" }}
                >
                  {creating ? "Criando análise…" : "Criar análise em rascunho"}
                </MuiButton>
              )}
            </div>
          )}
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

      <div className="flex w-full flex-wrap items-center gap-2">
        <Tooltip title="Salvar nos resultados">
          <IconButton size="small" onClick={onSave} aria-label="Salvar nos resultados">
            <BookmarkPlus size={15} />
          </IconButton>
        </Tooltip>
        {saved && (
          <span className="flex items-center gap-1 text-xs leading-[1.5] text-success">
            <Check size={13} aria-hidden="true" />
            Salvo nos resultados
          </span>
        )}
      </div>
    </div>
  );
}

type AnalysisChatProps = {
  selectedCount: number;
  projectId?: string;
};

export function AnalysisChat({ selectedCount, projectId }: AnalysisChatProps) {
  const [messages, setMessages] = useState<ChatEntry[]>(initialConversation);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [pending, setPending] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, pending]);

  function send(textOverride?: string) {
    const text = (textOverride ?? draft).trim();
    if (!text || pending) return;
    const userId = nextId("user");
    setMessages((prev) => [
      ...prev,
      { kind: "user", id: userId, time: currentTime(), text },
    ]);
    setDraft("");
    setVote(null);
    setPending(true);
    // Resposta simulada (tempo fixo apenas em handler).
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          kind: "assistant",
          id: nextId("assistant"),
          time: currentTime(),
          answer: matchAnswer(text),
        },
      ]);
      setPending(false);
    }, 900);
  }

  function resetConversation() {
    setMessages([]);
    setDraft("");
    setCopied(false);
    setVote(null);
    setPending(false);
    setSavedIds([]);
  }

  async function copyAnswer(answer: AnswerContent) {
    const text = [...answer.intro, ...answer.bullets, answer.tip ?? ""]
      .filter(Boolean)
      .join("\n")
      .replace(/\*\*/g, "");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard indisponível (ex.: contexto não seguro): mantém em silêncio.
    }
  }

  return (
    <Card className="flex w-full min-w-0 flex-col overflow-hidden min-[1440px]:h-full min-[1440px]:shrink-0 min-[1440px]:w-[592px]">
      <div className="flex h-16 w-full shrink-0 items-center gap-[10px] border-b border-line px-5">
        <Sparkles size={18} aria-hidden="true" className="text-brand" />
        <p className="text-base leading-[1.5] text-ink">Análise com IA</p>
        <div className="flex min-w-0 flex-1 items-start justify-end">
          <button
            type="button"
            onClick={resetConversation}
            className="flex items-center gap-1 whitespace-pre text-xs leading-[1.5] text-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <MessageSquarePlus size={13} aria-hidden="true" />
            Nova conversa
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex w-full min-h-0 flex-1 flex-col items-start gap-[18px] overflow-y-auto p-6"
      >
        <div className="flex w-full shrink-0 items-center gap-[7px]">
          <Database size={14} aria-hidden="true" className="text-muted" />
          <p className="whitespace-nowrap text-xs leading-[1.5] text-muted">
            {selectedCount} fontes conectadas · Análise comercial
          </p>
        </div>

        {messages.length === 0 && !pending && (
          <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border-default px-6 py-10 text-center">
            <Sparkles size={24} aria-hidden="true" className="text-muted" />
            <p className="text-sm font-semibold leading-[1.5] text-ink">
              Nova conversa iniciada
            </p>
            <p className="max-w-[360px] text-xs leading-[1.5] text-muted">
              Pergunte sobre receita, regiões, metas ou segmentos. As respostas
              são simuladas com dados fictícios deste protótipo.
            </p>
          </div>
        )}

        {messages.map((entry) =>
          entry.kind === "user" ? (
            <div
              key={entry.id}
              className="flex w-full shrink-0 flex-col items-start gap-[6px] rounded-lg bg-selection p-4 leading-[1.5]"
            >
              <p className="whitespace-nowrap text-[11px] font-semibold text-brand">
                VOCÊ · {entry.time}
              </p>
              <p className="w-full text-sm font-medium text-ink">{entry.text}</p>
            </div>
          ) : (
            <div
              key={entry.id}
              className="flex w-full shrink-0 flex-col items-start gap-[14px]"
            >
              <div className="flex w-full items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand">
                  <Sparkles size={16} aria-hidden="true" className="text-white" />
                </span>
                <p className="whitespace-nowrap text-[13px] leading-[1.5] text-ink">
                  SIGDATA IA
                </p>
                <p className="whitespace-nowrap text-[11px] leading-[1.5] text-muted">
                  {entry.time}
                </p>
              </div>

              <AnswerBody
                entry={entry}
                projectId={projectId}
                saved={savedIds.includes(entry.id)}
                onSave={() => {
                  saveResult(
                    entry.answer.analysisTitle ??
                      entry.answer.intro[0].slice(0, 64).replace(/\*\*/g, "") + "…",
                  );
                  setSavedIds((prev) =>
                    prev.includes(entry.id) ? prev : [...prev, entry.id],
                  );
                }}
              />

              <div className="flex w-full flex-wrap items-center gap-2">
                <Tooltip title="Copiar resposta">
                  <IconButton
                    size="small"
                    onClick={() => copyAnswer(entry.answer)}
                    aria-label="Copiar resposta"
                  >
                    <Copy size={15} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Gostei">
                  <IconButton
                    size="small"
                    onClick={() => setVote(vote === "up" ? null : "up")}
                    aria-pressed={vote === "up"}
                    aria-label="Gostei da resposta"
                    sx={
                      vote === "up"
                        ? { bgcolor: "var(--color-selection)", borderRadius: "6px" }
                        : undefined
                    }
                  >
                    <ThumbsUp size={15} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Não gostei">
                  <IconButton
                    size="small"
                    onClick={() => setVote(vote === "down" ? null : "down")}
                    aria-pressed={vote === "down"}
                    aria-label="Não gostei da resposta"
                    sx={
                      vote === "down"
                        ? { bgcolor: "var(--color-selection)", borderRadius: "6px" }
                        : undefined
                    }
                  >
                    <ThumbsDown size={15} />
                  </IconButton>
                </Tooltip>
                {copied && (
                  <span className="text-xs leading-[1.5] text-brand">Copiado</span>
                )}
              </div>
            </div>
          ),
        )}

        {pending && (
          <div
            role="status"
            aria-live="polite"
            className="flex w-full shrink-0 items-center gap-2"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand">
              <Sparkles size={16} aria-hidden="true" className="text-white" />
            </span>
            <p className="text-[13px] leading-[1.5] text-muted">
              Analisando as fontes conectadas
              <span className="ml-1 inline-flex gap-0.5">
                <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="flex w-full shrink-0 flex-col items-start gap-[10px] px-5 pb-4">
        <div className="flex w-full items-start gap-2">
          {suggestedQuestions.map((question) => (
            <MuiButton
              key={question}
              variant="outlined"
              size="small"
              onClick={() => send(question.replace(" ↗", ""))}
              sx={{
                flex: 1,
                minWidth: 0,
                justifyContent: "flex-start",
                textAlign: "left",
                p: "9px",
                fontSize: "0.6875rem",
                lineHeight: 1.5,
                textTransform: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {question}
            </MuiButton>
          ))}
        </div>

        <div className="flex w-full flex-col items-start gap-3 rounded-xl border border-info-border p-[14px] transition-colors focus-within:border-brand">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Pergunte sobre seus dados ou peça uma visualização..."
            aria-label="Pergunta para a análise com IA"
            className="w-full resize-none bg-transparent text-[13px] leading-[1.5] text-ink outline-none placeholder:text-muted"
          />
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[7px]">
              <Paperclip size={16} aria-hidden="true" className="text-muted" />
              <p className="whitespace-nowrap text-[11px] leading-[1.5] text-muted">
                {selectedCount} fontes selecionadas
              </p>
            </div>
            <IconButton
              color="primary"
              size="small"
              onClick={() => send()}
              disabled={pending || draft.trim().length === 0}
              aria-label="Enviar mensagem"
              sx={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              <ArrowUp size={17} />
            </IconButton>
          </div>
        </div>

        <p className="w-full text-center text-[10px] leading-[1.5] text-muted">
          Respostas simuladas com dados fictícios. Confira os números nas fontes
          indicadas.
        </p>
      </div>
    </Card>
  );
}
