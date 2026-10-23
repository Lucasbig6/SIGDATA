"use client";

import { useEffect, useRef, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { CheckCheck, Database, Ellipsis, Paperclip, X } from "lucide-react";
import { projectSources } from "@/lib/project-data";

type ChecklistProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  /** Versão compacta usada na sidebar. */
  dense?: boolean;
};

const rowBase =
  "flex w-full items-start gap-2 rounded-lg border p-3 transition-colors";

/** Lista de fontes com marcação/desmarcação (chat e sidebar). */
export function SourceChecklist({
  selectedIds,
  onToggle,
  dense = false,
}: ChecklistProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      {projectSources.map((source) => {
        const checked = selectedIds.includes(source.id);
        return (
          <label
            key={source.id}
            className={`cursor-pointer ${rowBase} ${
              checked
                ? "border-info-border bg-selection"
                : "border-line bg-surface hover:bg-subtle-bg"
            } ${dense ? "p-2" : "p-3"}`}
          >
            <Checkbox
              checked={checked}
              onChange={() => onToggle(source.id)}
              slotProps={{ input: { "aria-label": source.name } }}
              sx={{ padding: 0, marginTop: dense ? "-2px" : "2px" }}
            />
            <span className="flex min-w-0 flex-1 flex-col items-start gap-[2px] leading-[1.5]">
              <span
                className={`w-full font-semibold text-ink ${dense ? "text-[12px]" : "text-xs"}`}
              >
                {source.name}
              </span>
              {!dense && (
                <span className="w-full text-[11px] text-muted">
                  {source.meta}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/** Contador + seletor contextual de fontes exibido no composer. */
export function SourcePicker({
  selectedIds,
  onToggle,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-[7px] rounded-lg px-1.5 py-1 text-[11px] leading-[1.5] text-muted transition-colors hover:bg-subtle-bg hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <Paperclip size={15} aria-hidden="true" />
        <span className="whitespace-nowrap">
          {selectedIds.length}{" "}
          {selectedIds.length === 1 ? "fonte selecionada" : "fontes selecionadas"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Fontes usadas nesta conversa"
          className="absolute bottom-full left-0 z-30 mb-2 w-[300px] rounded-xl border border-line bg-surface p-3 shadow-lg"
        >
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Database size={15} aria-hidden="true" className="text-brand" />
              <p className="text-xs font-semibold leading-[1.5] text-ink">
                Fontes desta conversa
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold leading-[1.5] text-brand">
                {selectedIds.length} de {projectSources.length}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar seletor de fontes"
                className="flex size-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle-bg hover:text-ink"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          </div>

          <SourceChecklist selectedIds={selectedIds} onToggle={onToggle} dense />

          <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-subtle-bg p-2.5">
            <Ellipsis size={14} aria-hidden="true" className="mt-px shrink-0 text-muted" />
            <p className="text-[11px] leading-[1.5] text-muted">
              A IA consulta apenas as fontes marcadas. Desmarcar uma fonte exclui
              os dados dela das próximas respostas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Indicador discreto de sincronização das fontes (rodapé da sidebar). */
export function SourcesSyncStatus() {
  return (
    <div className="flex w-full flex-col items-start gap-1.5">
      <span className="flex items-center gap-1.5 rounded-md bg-success-bg px-2 py-1 text-[11px] font-medium leading-[1.5] text-success">
        <CheckCheck size={13} aria-hidden="true" />
        Fontes atualizadas
      </span>
      <p className="text-[11px] leading-[1.5] text-muted">
        01 out. 2026, às 08:30
      </p>
    </div>
  );
}
