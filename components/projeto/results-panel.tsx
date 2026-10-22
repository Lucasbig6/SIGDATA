import Card from "@mui/material/Card";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  FileText,
  PanelsTopLeft,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { regionRows } from "@/lib/project-data";

const chartBars: { label: string; height: number; accent: boolean }[] = [
  { label: "Jul", height: 27, accent: false },
  { label: "Ago", height: 35, accent: false },
  { label: "Set", height: 54, accent: true },
];

export function ResultsPanel() {
  return (
    <Card className="flex w-full min-w-0 flex-col min-[1440px]:h-full min-[1440px]:shrink-0 min-[1440px]:w-[462px]">
      <div className="flex h-16 w-full shrink-0 items-center gap-[10px] border-b border-line px-5">
        <PanelsTopLeft size={18} aria-hidden="true" className="text-brand" />
        <p className="text-base leading-[1.5] text-ink">Resultados</p>
        <div className="flex min-w-0 flex-1 items-start justify-end">
          <p className="whitespace-nowrap text-xs leading-[1.5] text-muted">
            3 salvos
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-[14px] p-4">
        <p className="w-full text-xs leading-[1.5] text-muted">
          Transforme descobertas em entregáveis para sua equipe.
        </p>

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
          {regionRows.map((row) => (
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
            className="whitespace-nowrap text-[11px] font-semibold leading-[1.5] text-brand transition-colors hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Abrir tabela completa →
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
          <Button variant="neutral" size="md">
            Adicionar ao painel
          </Button>
        </div>

        <p className="w-full text-[11px] leading-[1.5] text-muted">
          Os resultados ficam salvos neste projeto e podem ser revisados a
          qualquer momento.
        </p>
      </div>
    </Card>
  );
}
