"use client";

import { useState } from "react";
import { PanelRightClose, PanelsTopLeft, Sparkles } from "lucide-react";
import { ArtifactCard } from "./artifact-card";
import { PanelPickerDialog } from "./panel-picker-dialog";
import { useExplorer, type Artifact } from "@/lib/explorer-store";
import { useSavedResults } from "@/lib/results-store";

type WorkspacePanelProps = {
  projectId: string;
  onCollapse: () => void;
};

/**
 * Área de trabalho: artefatos gerados na conversa (gráficos, tabelas e
 * resumos) + resultados salvos pelo assistente.
 */
export function WorkspacePanel({ projectId, onCollapse }: WorkspacePanelProps) {
  const { artifacts, focusedArtifactId } = useExplorer();
  const savedResults = useSavedResults();
  const [pickerArtifact, setPickerArtifact] = useState<Artifact | null>(null);

  return (
    <>
      <div className="flex h-14 w-full shrink-0 items-center gap-2.5 border-b border-line px-5">
        <PanelsTopLeft size={18} aria-hidden="true" className="text-brand" />
        <p className="text-base leading-[1.5] text-ink">Área de trabalho</p>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <p className="whitespace-nowrap text-xs leading-[1.5] text-muted">
            {artifacts.length} {artifacts.length === 1 ? "artefato" : "artefatos"}
          </p>
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Recolher área de trabalho"
            title="Recolher área de trabalho"
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle-bg hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <PanelRightClose size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex w-full min-h-0 flex-1 flex-col items-start gap-3.5 overflow-y-auto p-4">
        <p className="w-full text-xs leading-[1.5] text-muted">
          Transforme descobertas em entregáveis para sua equipe.
        </p>

        {savedResults.length > 0 && (
          <div className="flex w-full flex-col items-start gap-3 rounded-xl border border-brand/30 p-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} aria-hidden="true" className="text-brand" />
              <p className="text-xs font-semibold leading-[1.5] text-brand">
                Salvos pelo assistente
              </p>
            </div>
            {savedResults.map((result) => (
              <div
                key={result.id}
                className="flex w-full items-center justify-between gap-3 border-t border-line pt-[6px]"
              >
                <p className="min-w-0 truncate text-[11px] leading-[1.5] text-ink">
                  {result.title}
                </p>
                <p className="shrink-0 text-[10px] leading-[1.5] text-muted">
                  {result.time}
                </p>
              </div>
            ))}
          </div>
        )}

        {artifacts.map((artifact) => (
          <ArtifactCard
            key={artifact.id}
            artifact={artifact}
            projectId={projectId}
            focused={artifact.id === focusedArtifactId}
            onAddToPanel={() => setPickerArtifact(artifact)}
          />
        ))}

        <p className="w-full text-[11px] leading-[1.5] text-muted">
          Os artefatos ficam salvos neste projeto e podem ser revisados ou
          publicados a qualquer momento.
        </p>
      </div>

      <PanelPickerDialog
        open={pickerArtifact !== null}
        onClose={() => setPickerArtifact(null)}
        projectId={projectId}
        artifact={pickerArtifact}
      />
    </>
  );
}
