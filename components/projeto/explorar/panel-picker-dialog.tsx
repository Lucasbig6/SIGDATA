"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Check, PanelsTopLeft, Plus } from "lucide-react";
import { addWidget, useProjectPanels } from "@/lib/panels-store";
import type { Artifact, ArtifactKind } from "@/lib/explorer-store";

const widgetKind: Record<ArtifactKind, "kpi" | "grafico" | "tabela"> = {
  grafico: "grafico",
  tabela: "tabela",
  resumo: "kpi",
};

type PanelPickerDialogProps = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  artifact: Artifact | null;
};

/** Envia um artefato da área de trabalho para um painel do projeto. */
export function PanelPickerDialog({
  open,
  onClose,
  projectId,
  artifact,
}: PanelPickerDialogProps) {
  const panels = useProjectPanels().filter(
    (panel) => panel.projectId === projectId,
  );
  const [added, setAdded] = useState<{
    artifactId: string;
    panelId: string;
  } | null>(null);

  // O destaque só vale para o artefato aberto agora.
  const addedPanelId =
    added && added.artifactId === artifact?.id ? added.panelId : null;

  function handleAdd(panelId: string) {
    if (!artifact) return;
    addWidget(panelId, {
      kind: widgetKind[artifact.kind],
      title: artifact.title,
    });
    setAdded({ artifactId: artifact.id, panelId });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Adicionar ao painel
      </DialogTitle>
      <DialogContent className="flex flex-col gap-3 pt-4!">
        <p className="text-sm leading-[1.5] text-muted">
          Escolha o painel que receberá{" "}
          <span className="font-semibold text-ink">
            {artifact?.title ?? "o artefato"}
          </span>
          . O widget entra como rascunho e pode ser reordenado depois.
        </p>

        {panels.map((panel) => {
          const added = addedPanelId === panel.id;
          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => handleAdd(panel.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                added
                  ? "border-info-border bg-selection"
                  : "border-line hover:bg-subtle-bg"
              }`}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-selection">
                <PanelsTopLeft size={17} aria-hidden="true" className="text-brand" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold leading-[1.5] text-ink">
                  {panel.title}
                </span>
                <span className="text-[11px] leading-[1.5] text-muted">
                  {panel.status === "publicado" ? "Publicado" : "Rascunho"} ·{" "}
                  {panel.widgets.length}{" "}
                  {panel.widgets.length === 1 ? "widget" : "widgets"} · atualizado{" "}
                  {panel.updatedAt}
                </span>
              </span>
              {added ? (
                <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold leading-[1.5] text-success">
                  <Check size={14} aria-hidden="true" />
                  Adicionado
                </span>
              ) : (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-line text-brand">
                  <Plus size={15} aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}

        {panels.length === 0 && (
          <p className="rounded-xl border border-dashed border-border-default p-4 text-center text-xs leading-[1.5] text-muted">
            Este projeto ainda não tem painéis. Crie um na aba Painéis e volte
            para adicionar o artefato.
          </p>
        )}

        {addedPanelId && (
          <p role="status" className="flex items-center gap-1.5 text-xs leading-[1.5] text-success">
            <Check size={14} aria-hidden="true" />
            Widget adicionado ao painel selecionado.
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Fechar
        </Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          Concluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
