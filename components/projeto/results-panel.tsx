"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Check,
  FileText,
  PanelsTopLeft,
  Sparkles,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { chartBars, regionRows } from "@/lib/project-data";
import { useSavedResults } from "@/lib/results-store";

const extraRows = [
  { region: "Norte", value: "R$ 180.000" },
  { region: "Exterior", value: "R$ 90.000" },
];

export function ResultsPanel() {
  const savedResults = useSavedResults();
  const [tableOpen, setTableOpen] = useState(false);
  const [addedToPanel, setAddedToPanel] = useState(false);

  const rows = tableOpen ? [...regionRows, ...extraRows] : regionRows;

  return (
    <Card className="flex w-full min-w-0 flex-col min-[1440px]:h-full min-[1440px]:shrink-0 min-[1440px]:w-[462px]">
      <div className="flex h-16 w-full shrink-0 items-center gap-[10px] border-b border-line px-5">
        <PanelsTopLeft size={18} aria-hidden="true" className="text-brand" />
        <p className="text-base leading-[1.5] text-ink">Resultados</p>
        <div className="flex min-w-0 flex-1 items-start justify-end">
          <p className="whitespace-nowrap text-xs leading-[1.5] text-muted">
            {3 + savedResults.length} salvos
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-[14px] p-4">
        <p className="w-full text-xs leading-[1.5] text-muted">
          Transforme descobertas em entregáveis para sua equipe.
        </p>

        {savedResults.length > 0 && (
          <div className="flex w-full flex-col items-start gap-3 rounded-xl border border-brand/30 p-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} aria-hidden="true" className="text-brand" />
              <p className="whitespace-nowrap text-xs font-semibold leading-[1.5] text-brand">
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

        <div className="flex w-full flex-col items-start gap-3 rounded-xl border border-line p-4 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2">
            <FileText size={18} aria-hidden="true" className="text-brand" />
            <p className="whitespace-nowrap text-xs font-semibold leading-[1.5] text-brand">
              Resumo executivo
            </p>
          </div>
          <p className="w-full text-[15px] leading-[1.5] text-ink">
            Desempenho de setembro
          </p>
          <p className="w-full text-xs leading-[1.5] text-muted">
            Receita de R$ 2,48 mi, alta de 12,4%. Sudeste responde por 65,8% do
            crescimento.
          </p>
          <div className="flex w-full items-start justify-between">
            <p className="whitespace-nowrap text-[10px] leading-[1.5] text-muted">
              2 fontes · salvo às 09:42
            </p>
            <ArrowUpRight size={16} aria-hidden="true" className="text-brand" />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[10px] rounded-xl border border-line p-4 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2">
            <Table2 size={18} aria-hidden="true" className="text-brand" />
            <p className="whitespace-nowrap text-xs font-semibold leading-[1.5] text-brand">
              Receita por região
            </p>
          </div>
          <div className="flex w-full items-start justify-between whitespace-nowrap text-[11px] leading-[1.5] text-muted">
            <p>Região</p>
            <p>Setembro</p>
          </div>
          {rows.map((row) => (
            <div
              key={row.region}
              className="flex w-full items-start justify-between whitespace-nowrap border-t border-line pt-[6px] text-[11px] leading-[1.5] text-ink"
            >
              <p>{row.region}</p>
              <p className="font-semibold">{row.value}</p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTableOpen((current) => !current)}
            className="whitespace-nowrap text-[11px] font-semibold leading-[1.5] text-brand transition-colors hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {tableOpen ? "Fechar tabela →" : "Abrir tabela completa →"}
          </button>
        </div>

        <div className="flex w-full flex-col items-start gap-3 rounded-xl bg-selection p-4">
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined size={18} aria-hidden="true" className="text-brand" />
            <p className="whitespace-nowrap text-xs font-semibold leading-[1.5] text-brand">
              Visualização sugerida
            </p>
          </div>
          <p className="w-full text-sm leading-[1.5] text-ink">
            Evolução da receita
          </p>
          <div className="flex h-[75px] w-full items-end gap-[14px] overflow-hidden px-[14px]">
            {chartBars.map((bar) => (
              <div
                key={bar.label}
                className="flex min-w-0 flex-1 flex-col items-center gap-1"
              >
                <div
                  className={`w-full shrink-0 rounded-[3px] ${
                    bar.accent ? "bg-brand" : "bg-info-border"
                  }`}
                  style={{ height: bar.height }}
                />
                <p className="whitespace-nowrap text-[10px] leading-[1.5] text-muted">
                  {bar.label}
                </p>
              </div>
            ))}
          </div>
          <p className="w-full text-[11px] leading-[1.5] text-muted">
            Colunas · receita líquida por mês
          </p>
          {addedToPanel ? (
            <p
              role="status"
              className="flex w-full items-center gap-1.5 text-xs leading-[1.5] text-success"
            >
              <Check size={15} aria-hidden="true" />
              Adicionado ao Painel Comercial (simulação)
            </p>
          ) : (
            <Button
              variant="neutral"
              size="md"
              onClick={() => setAddedToPanel(true)}
            >
              Adicionar ao painel
            </Button>
          )}
        </div>

        <p className="w-full text-[11px] leading-[1.5] text-muted">
          Os resultados ficam salvos neste projeto e podem ser revisados a
          qualquer momento.
        </p>
      </div>
    </Card>
  );
}
