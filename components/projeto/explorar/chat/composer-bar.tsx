"use client";

import {
  ComposerPrimitive,
  SuggestionPrimitive,
  ThreadPrimitive,
  useAuiState,
} from "@assistant-ui/react";
import { ArrowUp, ArrowUpRight, Sparkles } from "lucide-react";
import { SourcePicker } from "../source-controls";

/** Sugestão compacta exibida acima do composer durante a conversa. */
function ChipSuggestion() {
  return (
    <SuggestionPrimitive.Trigger
      send
      className="min-w-0 flex-1 truncate rounded-lg border border-line bg-subtle-bg px-3 py-2 text-left text-[11px] leading-[1.5] text-ink transition-colors hover:border-info-border hover:bg-selection focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <SuggestionPrimitive.Title />
    </SuggestionPrimitive.Trigger>
  );
}

/** Cartão de sugestão exibido quando a conversa ainda está vazia. */
function StarterSuggestion() {
  return (
    <SuggestionPrimitive.Trigger
      send
      className="group flex w-full items-start gap-2.5 rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-info-border hover:bg-subtle-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-selection">
        <Sparkles size={14} aria-hidden="true" className="text-brand" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <SuggestionPrimitive.Title className="text-xs font-semibold leading-[1.5] text-ink" />
        <span className="text-[11px] leading-[1.5] text-muted">
          Enviar esta pergunta
        </span>
      </span>
      <ArrowUpRight
        size={15}
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-brand"
      />
    </SuggestionPrimitive.Trigger>
  );
}

/** Enviar: botão ativo enquanto o composer pode enviar, fixo no layout. */
function SendButton() {
  const canSend = useAuiState((state) => state.composer.canSend);

  if (!canSend) {
    return (
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-subtle-bg text-muted"
      >
        <ArrowUp size={16} />
      </span>
    );
  }

  return (
    <ComposerPrimitive.Send
      aria-label="Enviar mensagem"
      className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-on-brand transition-colors hover:bg-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <ArrowUp size={16} aria-hidden="true" />
    </ComposerPrimitive.Send>
  );
}

type ComposerBarProps = {
  selectedIds: string[];
  onToggleSource: (id: string) => void;
  /** Esconde as sugestões enquanto o assistente responde. */
  showSuggestions: boolean;
  /** Lista completa de sugestões (estado vazio da conversa). */
  starter: boolean;
};

export function ComposerBar({
  selectedIds,
  onToggleSource,
  showSuggestions,
  starter,
}: ComposerBarProps) {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-2.5 border-t border-line bg-surface px-5 pb-4 pt-3">
      {showSuggestions && !starter && (
        <div className="flex w-full items-start gap-2">
          <ThreadPrimitive.SuggestionByIndex
            index={0}
            components={{ Suggestion: ChipSuggestion }}
          />
          <ThreadPrimitive.SuggestionByIndex
            index={1}
            components={{ Suggestion: ChipSuggestion }}
          />
        </div>
      )}

      <ComposerPrimitive.Root className="flex w-full flex-col items-start gap-3 rounded-xl border border-info-border p-[14px] transition-colors focus-within:border-brand">
        <ComposerPrimitive.Input
          rows={1}
          placeholder="Pergunte sobre seus dados ou peça uma visualização..."
          aria-label="Pergunta para a análise com IA"
          className="w-full resize-none bg-transparent text-[13px] leading-[1.5] text-ink outline-none placeholder:text-muted"
        />
        <div className="flex w-full items-center justify-between gap-3">
          <SourcePicker selectedIds={selectedIds} onToggle={onToggleSource} />
          <SendButton />
        </div>
      </ComposerPrimitive.Root>

      <p className="w-full text-center text-[10px] leading-[1.5] text-muted">
        Respostas simuladas com dados fictícios. Confira os números nas fontes
        indicadas.
      </p>
    </div>
  );
}

export { StarterSuggestion };
