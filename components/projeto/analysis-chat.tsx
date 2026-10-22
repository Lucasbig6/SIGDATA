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
  Copy,
  Database,
  Lightbulb,
  Paperclip,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  assistantPlainText,
  initialAssistantTime as assistantTime,
  initialUserQuestion,
  suggestedQuestions,
} from "@/lib/project-data";

type ChatEntry =
  | { kind: "user"; id: string; time: string; text: string }
  | { kind: "assistant"; id: string; time: string };

function initialConversation(): ChatEntry[] {
  return [
    { kind: "user", id: "user-initial", time: initialUserQuestion.time, text: initialUserQuestion.text },
    { kind: "assistant", id: "assistant-initial", time: assistantTime },
  ];
}

function currentTime(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AssistantAnswer() {
  return (
    <div className="flex w-full flex-col items-start gap-[14px]">
      <p className="w-full text-sm leading-[1.65] text-ink">
        Em setembro, a receita líquida chegou a{" "}
        <strong className="font-bold">R$ 2,48 milhões</strong>, um crescimento
        de <strong className="font-bold">12,4%</strong> sobre agosto (R$ 2,21
        milhões). O avanço foi de R$ 273,6 mil.{" "}
        <span className="font-semibold text-brand">[1]</span>
      </p>

      <div className="flex w-full flex-col items-start gap-[9px] text-[13px]">
        <div className="flex w-full items-start gap-[10px]">
          <p className="shrink-0 leading-[1.5] text-brand">•</p>
          <p className="min-w-0 flex-1 leading-[1.6] text-ink">
            Sudeste liderou o avanço. R$ 180 mil adicionais, equivalentes a
            65,8% do crescimento total. [1]
          </p>
        </div>
        <div className="flex w-full items-start gap-[10px]">
          <p className="shrink-0 leading-[1.5] text-brand">•</p>
          <p className="min-w-0 flex-1 leading-[1.6] text-ink">
            Sul foi o segundo destaque. Contribuição de R$ 62 mil; Nordeste e
            Centro-Oeste somaram R$ 31,6 mil. [1]
          </p>
        </div>
        <div className="flex w-full items-start gap-[10px]">
          <p className="shrink-0 leading-[1.5] text-brand">•</p>
          <p className="min-w-0 flex-1 leading-[1.6] text-ink">
            Meta mensal superada. A receita ficou 5,5% acima da meta de R$ 2,35
            milhões. [1, 2]
          </p>
        </div>
      </div>

      <div className="flex w-full items-start gap-[9px] rounded-lg bg-subtle-bg p-3">
        <Lightbulb size={16} aria-hidden="true" className="mt-px shrink-0 text-brand" />
        <p className="min-w-0 flex-1 text-xs leading-[1.5] text-ink">
          Próximo passo: detalhar os segmentos de clientes do Sudeste para
          identificar o que impulsionou a receita.
        </p>
      </div>

      <div className="flex w-full flex-wrap content-start items-start gap-[7px]">
        <Chip
          size="small"
          label="1 · Vendas 2026"
          sx={{
            bgcolor: "var(--color-selection)",
            color: "var(--color-brand)",
            borderRadius: "6px",
          }}
        />
        <Chip
          size="small"
          label="2 · Metas comerciais"
          sx={{
            bgcolor: "var(--color-selection)",
            color: "var(--color-brand)",
            borderRadius: "6px",
          }}
        />
      </div>
    </div>
  );
}

type AnalysisChatProps = {
  selectedCount: number;
};

export function AnalysisChat({ selectedCount }: AnalysisChatProps) {
  const [messages, setMessages] = useState<ChatEntry[]>(initialConversation);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { kind: "user", id: `user-${Date.now()}`, time: currentTime(), text },
    ]);
    setDraft("");
  }

  function resetConversation() {
    setMessages(initialConversation());
    setDraft("");
    setCopied(false);
    setVote(null);
  }

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(assistantPlainText);
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
            className="whitespace-pre text-xs leading-[1.5] text-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {"Nova conversa  +"}
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

              <AssistantAnswer />

              <div className="flex w-full flex-wrap items-center gap-2">
                <Tooltip title="Copiar resposta">
                  <IconButton size="small" onClick={copyAnswer} aria-label="Copiar resposta">
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
                <MuiButton
                  variant="text"
                  color="primary"
                  size="small"
                  startIcon={<BookmarkPlus size={15} />}
                  className="px-0! text-brand!"
                >
                  Salvar nos resultados
                </MuiButton>
                {copied && (
                  <span className="text-xs leading-[1.5] text-brand">Copiado</span>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      <div className="flex w-full shrink-0 flex-col items-start gap-[10px] px-5 pb-4">
        <div className="flex w-full items-start gap-2">
          {suggestedQuestions.map((question) => (
            <MuiButton
              key={question}
              variant="outlined"
              size="small"
              onClick={() => setDraft(question.replace(" ↗", ""))}
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
              onClick={send}
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
          A IA pode cometer erros. Confira os resultados nas fontes indicadas.
        </p>
      </div>
    </Card>
  );
}
