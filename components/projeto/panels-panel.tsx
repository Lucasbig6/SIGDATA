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
  ArrowUpRight,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  LayoutDashboard,
  Pencil,
  Plus,
  Table2,
  Trash2,
  X,
} from "lucide-react";
import { Button as UiButton } from "@/components/ui/button";
import {
  addPanel,
  addWidget,
  moveWidget,
  removePanel,
  removeWidget,
  updatePanel,
  useProjectPanels,
} from "@/lib/panels-store";
import type { WidgetKind } from "@/lib/panels-store-data";
import { useAnalyses } from "@/lib/analyses-store";

const chipBase =
  "rounded-lg border px-3 py-1.5 text-xs font-medium leading-[1.5] transition-colors";

const kindLabels: Record<WidgetKind, string> = {
  kpi: "KPI",
  grafico: "Gráfico",
  tabela: "Tabela",
};

function KindIcon({ kind, size = 16 }: { kind: WidgetKind; size?: number }) {
  if (kind === "kpi") return <ArrowUpRight size={size} aria-hidden="true" />;
  if (kind === "grafico") return <ChartNoAxesCombined size={size} aria-hidden="true" />;
  return <Table2 size={size} aria-hidden="true" />;
}

function WidgetMock({ kind }: { kind: WidgetKind }) {
  if (kind === "kpi") {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold leading-[1.4] text-ink">R$ 2,48 mi</p>
        <p className="text-[11px] leading-[1.5] text-success">▲ 12,4% vs. agosto</p>
      </div>
    );
  }
  if (kind === "grafico") {
    return (
      <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
        {[38, 58, 46, 72, 88].map((height, index) => (
          <div
            key={index}
            className={`w-4 rounded-t ${index === 4 ? "bg-brand" : "bg-brand/30"}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1" aria-hidden="true">
      {[60, 80, 45].map((width, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="h-2 rounded bg-line" style={{ width: `${width}%` }} />
          <div className="h-2 w-6 rounded bg-brand/30" />
        </div>
      ))}
    </div>
  );
}

export function PanelsPanel({ projectId }: { projectId: string }) {
  const panels = useProjectPanels().filter(
    (panel) => panel.projectId === projectId,
  );
  const analyses = useAnalyses().filter(
    (analysis) => analysis.projectId === projectId,
  );

  const [creating, setCreating] = useState<{
    title: string;
    template: "vazio" | "resumo";
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [widgetDialog, setWidgetDialog] = useState<{
    kind: WidgetKind;
    title: string;
    analysisId: string;
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editing = panels.find((panel) => panel.id === editingId) ?? null;

  function handleCreate() {
    if (!creating) return;
    const title = creating.title.trim() || "Painel sem título";
    const panel = addPanel({ projectId, title, template: creating.template });
    setCreating(null);
    setEditingId(panel.id);
    setMessage(`Painel “${title}” criado como rascunho.`);
  }

  function handlePublishRequest(id: string) {
    setPublishingId(id);
  }

  function handlePublishConfirm() {
    if (!publishingId) return;
    setBusy(true);
    // Publicação simulada (tempo fixo apenas em handler).
    setTimeout(() => {
      updatePanel(publishingId, { status: "publicado" });
      setBusy(false);
      setPublishingId(null);
      setMessage("Painel publicado (simulação).");
    }, 1200);
  }

  function handleAddWidget() {
    if (!widgetDialog || !editingId) return;
    addWidget(editingId, {
      kind: widgetDialog.kind,
      title: widgetDialog.title.trim() || `Novo ${kindLabels[widgetDialog.kind].toLowerCase()}`,
      analysisId: widgetDialog.analysisId || undefined,
    });
    setWidgetDialog(null);
  }

  return (
    <Card className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-3 border-b border-line p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold leading-[1.5] text-ink">
              Painéis
            </h2>
            <span className="rounded-md bg-background px-[9px] py-1 text-xs font-medium leading-[1.5] text-muted">
              {panels.length}
            </span>
          </div>
          <p className="text-sm leading-[1.5] text-muted">
            Monte widgets em uma grade, organize a ordem e simule a publicação.
          </p>
        </div>
        <UiButton
          variant="primary"
          size="md"
          startIcon={<Plus size={16} />}
          onClick={() => {
            setMessage(null);
            setCreating({ title: "", template: "resumo" });
          }}
        >
          Novo painel
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

        {panels.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border-default px-6 py-10 text-center">
            <LayoutDashboard size={24} aria-hidden="true" className="text-muted" />
            <p className="text-sm font-semibold leading-[1.5] text-ink">
              Nenhum painel neste projeto
            </p>
            <p className="max-w-[380px] text-xs leading-[1.5] text-muted">
              Crie um painel para organizar KPIs, gráficos e tabelas das suas
              análises.
            </p>
          </div>
        ) : (
          <ul className="flex w-full flex-col divide-y divide-line rounded-xl border border-border-default">
            {panels.map((panel) => (
              <li
                key={panel.id}
                className="flex w-full flex-col gap-3 p-4 md:flex-row md:items-center"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold leading-[1.5] text-ink">
                      {panel.title}
                    </p>
                    <Chip
                      size="small"
                      label={panel.status === "publicado" ? "Publicado" : "Rascunho"}
                      sx={{
                        borderRadius: "6px",
                        bgcolor:
                          panel.status === "publicado"
                            ? "var(--color-success-bg)"
                            : "var(--color-warning-bg)",
                        color:
                          panel.status === "publicado"
                            ? "var(--color-success)"
                            : "var(--color-warning)",
                      }}
                    />
                  </div>
                  <p className="text-xs leading-[1.5] text-muted">
                    {panel.widgets.length} widget
                    {panel.widgets.length === 1 ? "" : "s"} · Coluna
                    {panel.layout === "2" ? "s" : ""} {panel.layout} · Atualizado
                    em {panel.updatedAt}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <UiButton
                    variant="subtle"
                    size="sm"
                    startIcon={<Pencil size={14} />}
                    onClick={() => {
                      setMessage(null);
                      setEditingId(panel.id);
                    }}
                  >
                    Editar
                  </UiButton>
                  {panel.status !== "publicado" && (
                    <UiButton
                      variant="neutral"
                      size="sm"
                      onClick={() => handlePublishRequest(panel.id)}
                    >
                      Publicar
                    </UiButton>
                  )}
                  <UiButton
                    variant="subtle"
                    size="sm"
                    startIcon={<Trash2 size={14} />}
                    onClick={() => {
                      removePanel(panel.id);
                      setMessage("Painel removido nesta sessão.");
                    }}
                    aria-label={`Remover painel ${panel.title}`}
                  >
                    Remover
                  </UiButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Diálogo: novo painel */}
      <Dialog
        open={creating !== null}
        onClose={() => setCreating(null)}
        maxWidth="sm"
        fullWidth
      >
        {creating && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>Novo painel</DialogTitle>
            <DialogContent className="flex flex-col gap-4 pt-4!">
              <TextField
                label="Nome do painel"
                value={creating.title}
                onChange={(event) =>
                  setCreating({ ...creating, title: event.target.value })
                }
                size="small"
                fullWidth
                autoFocus
                helperText="Ex.: “Cobertura vacinal — regional”"
              />
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold leading-[1.5] text-ink">
                  Modelo inicial
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Modelo">
                  {(
                    [
                      { value: "resumo", label: "Resumo executivo" },
                      { value: "vazio", label: "Em branco" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={creating.template === option.value}
                      onClick={() =>
                        setCreating({ ...creating, template: option.value })
                      }
                      className={`${chipBase} ${
                        creating.template === option.value
                          ? "border-brand bg-brand text-white"
                          : "border-border-default text-ink hover:border-brand/40"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={() => setCreating(null)}>
                Cancelar
              </Button>
              <Button variant="contained" color="primary" onClick={handleCreate}>
                Criar painel
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Diálogo: confirmar publicação (simulada) */}
      <Dialog
        open={publishingId !== null}
        onClose={() => !busy && setPublishingId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Publicar painel</DialogTitle>
        <DialogContent>
          <p className="text-sm leading-[1.5] text-muted">
            Simulação de publicação: o painel passará a ficar disponível como
            versão publicada. Nada é enviado a servidores.
          </p>
          {busy && (
            <p
              role="status"
              className="mt-3 flex items-center gap-2 text-xs leading-[1.5] text-brand"
            >
              <span className="size-3 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Publicando…
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setPublishingId(null)} disabled={busy}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePublishConfirm}
            disabled={busy}
          >
            Publicar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: editor de widgets */}
      <Dialog
        open={editing !== null}
        onClose={() => setEditingId(null)}
        maxWidth="md"
        fullWidth
      >
        {editing && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              Editar “{editing.title}”
            </DialogTitle>
            <DialogContent className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs leading-[1.5] text-muted">Layout:</p>
                  {(["1", "2"] as const).map((layout) => (
                    <button
                      key={layout}
                      type="button"
                      aria-pressed={editing.layout === layout}
                      onClick={() => updatePanel(editing.id, { layout })}
                      className={`${chipBase} ${
                        editing.layout === layout
                          ? "border-brand bg-brand text-white"
                          : "border-border-default text-ink hover:border-brand/40"
                      }`}
                    >
                      {layout === "1" ? "1 coluna" : "2 colunas"}
                    </button>
                  ))}
                </div>
                <UiButton
                  variant="neutral"
                  size="sm"
                  startIcon={<Plus size={14} />}
                  onClick={() =>
                    setWidgetDialog({ kind: "grafico", title: "", analysisId: "" })
                  }
                >
                  Adicionar widget
                </UiButton>
              </div>

              {editing.widgets.length === 0 ? (
                <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border-default px-6 py-8 text-center">
                  <LayoutDashboard size={22} aria-hidden="true" className="text-muted" />
                  <p className="text-xs leading-[1.5] text-muted">
                    Painel vazio. Adicione o primeiro widget.
                  </p>
                </div>
              ) : (
                <div
                  className={`grid grid-cols-1 gap-3 ${
                    editing.layout === "2" ? "md:grid-cols-2" : ""
                  }`}
                >
                  {editing.widgets.map((widget, index) => (
                    <div
                      key={widget.id}
                      className="flex flex-col gap-3 rounded-xl border border-border-default p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="text-brand">
                            <KindIcon kind={widget.kind} />
                          </span>
                          <p className="truncate text-xs font-semibold leading-[1.5] text-ink">
                            {widget.title}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            aria-label={`Mover widget ${widget.title} para cima`}
                            disabled={index === 0}
                            onClick={() => moveWidget(editing.id, widget.id, -1)}
                            className="flex size-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle-bg hover:text-ink disabled:opacity-40"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Mover widget ${widget.title} para baixo`}
                            disabled={index === editing.widgets.length - 1}
                            onClick={() => moveWidget(editing.id, widget.id, 1)}
                            className="flex size-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle-bg hover:text-ink disabled:opacity-40"
                          >
                            <ChevronDown size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Remover widget ${widget.title}`}
                            onClick={() => removeWidget(editing.id, widget.id)}
                            className="flex size-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-error-bg hover:text-error"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <WidgetMock kind={widget.kind} />
                      <p className="text-[11px] leading-[1.5] text-muted">
                        {kindLabels[widget.kind]}
                        {widget.analysisId
                          ? ` · ${analyses.find((a) => a.id === widget.analysisId)?.title ?? "análise"}`
                          : " · dados fictícios"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={() => setEditingId(null)}>
                Concluir
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Diálogo: adicionar widget */}
      <Dialog
        open={widgetDialog !== null}
        onClose={() => setWidgetDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        {widgetDialog && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>Adicionar widget</DialogTitle>
            <DialogContent className="flex flex-col gap-4 pt-4!">
              <TextField
                select
                label="Tipo"
                value={widgetDialog.kind}
                onChange={(event) =>
                  setWidgetDialog({
                    ...widgetDialog,
                    kind: event.target.value as WidgetKind,
                  })
                }
                size="small"
              >
                {(["kpi", "grafico", "tabela"] as const).map((kind) => (
                  <MenuItem key={kind} value={kind}>
                    {kindLabels[kind]}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Título do widget"
                value={widgetDialog.title}
                onChange={(event) =>
                  setWidgetDialog({ ...widgetDialog, title: event.target.value })
                }
                size="small"
                fullWidth
                autoFocus
                helperText="Ex.: “Receita líquida — setembro”"
              />
              <TextField
                select
                label="Análise (opcional)"
                value={widgetDialog.analysisId}
                onChange={(event) =>
                  setWidgetDialog({
                    ...widgetDialog,
                    analysisId: event.target.value,
                  })
                }
                size="small"
              >
                <MenuItem value="">Nenhuma (dados fictícios)</MenuItem>
                {analyses.map((analysis) => (
                  <MenuItem key={analysis.id} value={analysis.id}>
                    {analysis.title}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={() => setWidgetDialog(null)}>
                Cancelar
              </Button>
              <Button variant="contained" color="primary" onClick={handleAddWidget}>
                Adicionar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Card>
  );
}
