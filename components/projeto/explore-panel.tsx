"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {
  CircleCheck,
  Play,
  RotateCcw,
  Save,
  Table2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addAnalysis } from "@/lib/analyses-store";
import {
  applyMetric,
  buildQuery,
  dimensionById,
  dimensions,
  formatMetricValue,
  metricById,
  metrics,
  type ExploreRow,
} from "@/lib/explore-data";
import { projectSources } from "@/lib/project-data";

type Status = "idle" | "loading" | "success" | "error";

type Result = { dimensionId: string; metricId: string; rows: ExploreRow[] };

const chipBase =
  "rounded-lg border px-3 py-1.5 text-xs font-medium leading-[1.5] transition-colors";

export function ExplorePanel({ projectId }: { projectId: string }) {
  const [dataset, setDataset] = useState(projectSources[0].name);
  const [dimensionId, setDimensionId] = useState("regiao");
  const [metricId, setMetricId] = useState("receita");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [saved, setSaved] = useState(false);

  const dimension = dimensionById(dimensionId);
  const metric = metricById(metricId);

  function handleRun() {
    if (!dimension) return;
    setSaved(false);
    setStatus("loading");
    // Consulta simulada (tempo fixo apenas em handler).
    setTimeout(() => {
      if (dimension.rows.length === 0) {
        setResult(null);
        setStatus("error");
        return;
      }
      setResult({
        dimensionId: dimension.id,
        metricId,
        rows: applyMetric(dimension.rows, metricId),
      });
      setStatus("success");
    }, 900);
  }

  function handleReset() {
    setSaved(false);
    setResult(null);
    setStatus("idle");
  }

  function handleSaveAnalysis() {
    if (!dimension || !metric) return;
    addAnalysis({
      projectId,
      title: `${metric.label} por ${dimension.label.toLowerCase()}`,
      type: "grafico",
      dataset,
      dimensionId: dimension.id,
      metricId: metric.id,
    });
    setSaved(true);
  }

  const max = result ? Math.max(...result.rows.map((row) => row.value)) : 1;

  return (
    <Card className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-1 border-b border-line p-5">
        <h2 className="text-base font-bold leading-[1.5] text-ink">
          Consulta guiada
        </h2>
        <p className="text-sm leading-[1.5] text-muted">
          Escolha um conjunto, uma dimensão e uma métrica para simular uma
          consulta. Valores fictícios, sem conexão real.
        </p>
      </div>

      <div className="flex w-full flex-col gap-5 p-5">
        {/* Controles */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            select
            label="Conjunto de dados"
            value={dataset}
            onChange={(event) => setDataset(event.target.value)}
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
            value={metricId}
            onChange={(event) => setMetricId(event.target.value)}
            size="small"
          >
            {metrics.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold leading-[1.5] text-ink">
            Agrupar por
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Dimensão">
            {dimensions.map((item) => {
              const selected = item.id === dimensionId;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setDimensionId(item.id)}
                  className={`${chipBase} ${
                    selected
                      ? "border-brand bg-brand text-white"
                      : "border-border-default text-ink hover:border-brand/40"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Consulta simulada gerada */}
        {dimension && metric && (
          <pre className="overflow-x-auto rounded-lg bg-subtle-bg p-3 font-mono text-[11px] leading-[1.6] text-ink">
            {buildQuery(dimension, metric)}
          </pre>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="md"
            startIcon={<Play size={16} />}
            onClick={handleRun}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Consultando…" : "Executar consulta"}
          </Button>
          <Button
            variant="subtle"
            size="md"
            startIcon={<RotateCcw size={16} />}
            onClick={handleReset}
          >
            Limpar
          </Button>
        </div>

        {/* Resultados */}
        {status === "idle" && (
          <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border-default px-6 py-10 text-center">
            <Table2 size={24} aria-hidden="true" className="text-muted" />
            <p className="text-sm font-semibold leading-[1.5] text-ink">
              Nenhuma consulta executada
            </p>
            <p className="max-w-[380px] text-xs leading-[1.5] text-muted">
              Selecione a dimensão e a métrica e clique em “Executar consulta”
              para ver a prévia em tabela e gráfico.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className="flex w-full flex-col gap-3" role="status" aria-label="Consultando dados">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
        )}

        {status === "error" && (
          <Alert
            severity="error"
            icon={<TriangleAlert size={18} />}
            action={
              <Button variant="subtle" size="sm" onClick={handleRun}>
                Tentar novamente
              </Button>
            }
          >
            A dimensão “{dimension?.label}” está indisponível nesta fonte
            (falha simulada). Escolha outra dimensão e execute novamente.
          </Alert>
        )}

        {status === "success" && result && (
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-xl border border-border-default p-4">
              {result.rows.map((row) => (
                <div key={row.category} className="flex items-center gap-3">
                  <p className="w-[120px] shrink-0 truncate text-xs leading-[1.5] text-ink">
                    {row.category}
                  </p>
                  <div className="h-4 min-w-0 flex-1 rounded bg-subtle-bg">
                    <div
                      className="h-4 rounded bg-gradient-to-r from-brand to-brand-accent"
                      style={{ width: `${Math.max(6, (row.value / max) * 100)}%` }}
                    />
                  </div>
                  <p className="w-[110px] shrink-0 text-right font-mono text-[11px] leading-[1.5] text-ink">
                    {formatMetricValue(row.value, result.metricId)}
                  </p>
                </div>
              ))}
            </div>

            <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-border-default">
              <table className="w-full min-w-[420px] border-collapse text-left">
                <thead>
                  <tr className="bg-subtle-bg">
                    <th className="px-4 py-2 text-[11px] font-semibold leading-[1.5] text-muted">
                      {(dimensionById(result.dimensionId)?.column ?? "").toUpperCase()}
                    </th>
                    <th className="px-4 py-2 text-right text-[11px] font-semibold leading-[1.5] text-muted">
                      VALOR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.category} className="border-t border-line">
                      <td className="px-4 py-2 text-sm leading-[1.5] text-ink">
                        {row.category}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-sm leading-[1.5] text-ink">
                        {formatMetricValue(row.value, result.metricId)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-[1.5] text-muted">
                Consulta simulada sobre “{dataset}” · {result.rows.length} linhas
                agregadas
              </p>
              <div className="flex items-center gap-3">
                {saved && (
                  <span className="flex items-center gap-1.5 text-xs leading-[1.5] text-success">
                    <CircleCheck size={15} aria-hidden="true" />
                    Rascunho criado — veja a aba Análises
                  </span>
                )}
                <Button
                  variant="neutral"
                  size="md"
                  startIcon={<Save size={16} />}
                  onClick={handleSaveAnalysis}
                >
                  Salvar como análise
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
