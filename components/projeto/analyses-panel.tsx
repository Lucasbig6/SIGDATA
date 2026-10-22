"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {
  ChartNoAxesCombined,
  CircleCheck,
  Pencil,
  Plus,
  Table2,
  Trash2,
} from "lucide-react";
import { Button as UiButton } from "@/components/ui/button";
import {
  addAnalysis,
  removeAnalysis,
  updateAnalysis,
  useAnalyses,
} from "@/lib/analyses-store";
import type { Analysis, AnalysisType } from "@/lib/analyses-data";
import {
  applyMetric,
  dimensionById,
  dimensions,
  formatMetricValue,
  metricById,
  metrics,
} from "@/lib/explore-data";
import { projectSources } from "@/lib/project-data";

type Draft = {
  id: string | null;
  title: string;
  type: AnalysisType;
  dataset: string;
  dimensionId: string;
  metricId: string;
};

const chipBase =
  "rounded-lg border px-3 py-1.5 text-xs font-medium leading-[1.5] transition-colors";

export function AnalysesPanel({ projectId }: { projectId: string }) {
  const analyses = useAnalyses().filter(
    (analysis) => analysis.projectId === projectId,
  );
  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function openNew() {
    setMessage(null);
    setDraft({
      id: null,
      title: "",
      type: "grafico",
      dataset: projectSources[0].name,
      dimensionId: "regiao",
      metricId: "receita",
    });
  }

  function openEdit(analysis: Analysis) {
    setMessage(null);
    setDraft({
      id: analysis.id,
      title: analysis.title,
      type: analysis.type,
      dataset: analysis.dataset,
      dimensionId: analysis.dimensionId,
      metricId: analysis.metricId,
    });
  }

  function handleSave(published: boolean) {
    if (!draft) return;
    const title = draft.title.trim() || "Análise sem título";
    if (draft.id === null) {
      addAnalysis({ ...draft, projectId, title, published });
      setMessage(
        published
          ? "Análise criada e publicada (simulação)."
          : "Rascunho criado. Nada foi publicado.",
      );
    } else {
      updateAnalysis(draft.id, { ...draft, title });
      if (published) updateAnalysis(draft.id, { published: true });
      setMessage(
        published
          ? "Alterações publicadas (simulação)."
          : "Rascunho salvo. A versão publicada não mudou.",
      );
    }
    setDraft(null);
  }

  function handlePublishExisting(id: string) {
    updateAnalysis(id, { published: true });
    setMessage("Análise publicada (simulação).");
  }

  function handleRemove(id: string) {
    removeAnalysis(id);
    setMessage("Análise removida desta sessão.");
  }

  const previewDimension = draft ? dimensionById(draft.dimensionId) : undefined;
  const previewRows = previewDimension
    ? applyMetric(previewDimension.rows, draft!.metricId)
    : [];
  const previewMax = previewRows.length
    ? Math.max(...previewRows.map((row) => row.value))
    : 1;

  return (
    <Card className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-3 border-b border-line p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold leading-[1.5] text-ink">
              Análises
            </h2>
            <span className="rounded-md bg-background px-[9px] py-1 text-xs font-medium leading-[1.5] text-muted">
              {analyses.length}
            </span>
          </div>
          <p className="text-sm leading-[1.5] text-muted">
            Alterações ficam em rascunho até você salvar ou publicar — nada é
            sobrescrito automaticamente.
          </p>
        </div>
        <UiButton
          variant="primary"
          size="md"
          startIcon={<Plus size={16} />}
          onClick={openNew}
        >
          Nova análise
        </UiButton>
      </div>

      <div className="flex w-full flex-col gap-4 p-5">
        {message && (
          <p
            role="status"
            className="flex items-center gap-1.5 text-xs leading-[1.5] text-success"
          >
            <CircleCheck size={15} aria-hidden="true" />
            {message}
          </p>
        )}

        {analyses.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border-default px-6 py-10 text-center">
            <ChartNoAxesCombined size={24} aria-hidden="true" className="text-muted" />
            <p className="text-sm font-semibold leading-[1.5] text-ink">
              Nenhuma análise neste projeto
            </p>
            <p className="max-w-[380px] text-xs leading-[1.5] text-muted">
              Crie uma análise manualmente ou salve o resultado de uma consulta
              na aba “Explorar”.
            </p>
          </div>
        ) : (
          <ul className="flex w-full flex-col divide-y divide-line rounded-xl border border-border-default">
            {analyses.map((analysis) => (
              <li
                key={analysis.id}
                className="flex w-full flex-col gap-3 p-4 md:flex-row md:items-center"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold leading-[1.5] text-ink">
                      {analysis.title}
                    </p>
                    <Chip
                      size="small"
                      label={analysis.published ? "Publicada" : "Rascunho"}
                      sx={{
                        borderRadius: "6px",
                        bgcolor: analysis.published
                          ? "var(--color-success-bg)"
                          : "var(--color-warning-bg)",
                        color: analysis.published
                          ? "var(--color-success)"
                          : "var(--color-warning)",
                      }}
                    />
                  </div>
                  <p className="text-xs leading-[1.5] text-muted">
                    {analysis.type === "grafico" ? "Gráfico" : "Tabela"} ·{" "}
                    {analysis.dataset} ·{" "}
                    {dimensionById(analysis.dimensionId)?.label ?? "—"} ·{" "}
                    {metricById(analysis.metricId)?.label ?? "—"} · Atualizada em{" "}
                    {analysis.updatedAt}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <UiButton
                    variant="subtle"
                    size="sm"
                    startIcon={<Pencil size={14} />}
                    onClick={() => openEdit(analysis)}
                  >
                    Editar
                  </UiButton>
                  {!analysis.published && (
                    <UiButton
                      variant="neutral"
                      size="sm"
                      onClick={() => handlePublishExisting(analysis.id)}
                    >
                      Publicar
                    </UiButton>
                  )}
                  <UiButton
                    variant="subtle"
                    size="sm"
                    startIcon={<Trash2 size={14} />}
                    onClick={() => handleRemove(analysis.id)}
                    aria-label={`Remover análise ${analysis.title}`}
                  >
                    Remover
                  </UiButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Editor visual com prévia (rascunho) */}
      <Dialog
        open={draft !== null}
        onClose={() => setDraft(null)}
        maxWidth="md"
        fullWidth
      >
        {draft && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              {draft.id === null ? "Nova análise" : "Editar análise"}
            </DialogTitle>
            <DialogContent className="flex flex-col gap-4">
              <TextField
                label="Título da análise"
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                size="small"
                fullWidth
                autoFocus
                helperText="Ex.: “Receita por região — setembro”"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                  select
                  label="Conjunto de dados"
                  value={draft.dataset}
                  onChange={(event) =>
                    setDraft({ ...draft, dataset: event.target.value })
                  }
                  size="small"
                >
                  {projectSources.map((source) => (
                    <MenuItem key={source.id} value={source.name}>
                      {source.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Métrica"
                  value={draft.metricId}
                  onChange={(event) =>
                    setDraft({ ...draft, metricId: event.target.value })
                  }
                  size="small"
                >
                  {metrics.map((metric) => (
                    <MenuItem key={metric.id} value={metric.id}>
                      {metric.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold leading-[1.5] text-ink">
                  Tipo de visualização
                </p>
                <div className="flex gap-2" role="group" aria-label="Tipo">
                  {(
                    [
                      { value: "tabela", label: "Tabela", icon: <Table2 size={14} /> },
                      {
                        value: "grafico",
                        label: "Gráfico",
                        icon: <ChartNoAxesCombined size={14} />,
                      },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={draft.type === option.value}
                      onClick={() => setDraft({ ...draft, type: option.value })}
                      className={`${chipBase} flex items-center gap-1.5 ${
                        draft.type === option.value
                          ? "border-brand bg-brand text-white"
                          : "border-border-default text-ink hover:border-brand/40"
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold leading-[1.5] text-ink">
                  Agrupar por
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Dimensão">
                  {dimensions.map((dimension) => (
                    <button
                      key={dimension.id}
                      type="button"
                      aria-pressed={draft.dimensionId === dimension.id}
                      onClick={() =>
                        setDraft({ ...draft, dimensionId: dimension.id })
                      }
                      className={`${chipBase} ${
                        draft.dimensionId === dimension.id
                          ? "border-brand bg-brand text-white"
                          : "border-border-default text-ink hover:border-brand/40"
                      }`}
                    >
                      {dimension.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prévia ao vivo do rascunho */}
              <div className="flex flex-col gap-2 rounded-xl border border-border-default p-4">
                <p className="text-xs font-semibold leading-[1.5] text-ink">
                  Prévia (rascunho)
                </p>
                {previewRows.length === 0 ? (
                  <p className="text-xs leading-[1.5] text-muted">
                    Dimensão indisponível para prévia. Escolha outra dimensão.
                  </p>
                ) : draft.type === "grafico" ? (
                  <div className="flex flex-col gap-2">
                    {previewRows.map((row) => (
                      <div key={row.category} className="flex items-center gap-3">
                        <p className="w-[96px] shrink-0 truncate text-[11px] leading-[1.5] text-ink">
                          {row.category}
                        </p>
                        <div className="h-3 min-w-0 flex-1 rounded bg-subtle-bg">
                          <div
                            className="h-3 rounded bg-gradient-to-r from-brand to-brand-accent"
                            style={{
                              width: `${Math.max(6, (row.value / previewMax) * 100)}%`,
                            }}
                          />
                        </div>
                        <p className="w-[96px] shrink-0 text-right font-mono text-[10px] leading-[1.5] text-ink">
                          {formatMetricValue(row.value, draft.metricId)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left">
                    <tbody>
                      {previewRows.map((row) => (
                        <tr key={row.category} className="border-t border-line first:border-t-0">
                          <td className="py-1.5 text-xs leading-[1.5] text-ink">
                            {row.category}
                          </td>
                          <td className="py-1.5 text-right font-mono text-xs leading-[1.5] text-ink">
                            {formatMetricValue(row.value, draft.metricId)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <p className="text-xs leading-[1.5] text-muted">
                Simulação: a versão salva só é atualizada quando você clica em
                “Salvar rascunho” ou “Publicar”.
              </p>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={() => setDraft(null)}>
                Descartar
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleSave(false)}
              >
                Salvar rascunho
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSave(true)}
              >
                Publicar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Card>
  );
}
