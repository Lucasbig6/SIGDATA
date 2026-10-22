import type { Metadata } from "next";
import { PageFooter } from "@/components/layout/page-footer";
import { Button } from "@/components/ui/button";
import { FontesView } from "@/components/fontes/fontes-view";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import { Database, Star, TriangleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Fontes de Dados | SIGDATA",
  description:
    "Conecte, organize e mantenha os dados que alimentam suas análises.",
};

const stats = [
  {
    title: "Total de fontes",
    value: "6",
    context: "Conexões e arquivos",
    icon: true,
  },
  {
    title: "Prontas para análise",
    value: "4",
    context: "Disponíveis para seus projetos",
    icon: false,
  },
  {
    title: "Em processamento",
    value: "1",
    context: "Custos operacionais",
    icon: false,
  },
  {
    title: "Requer atenção",
    value: "1",
    context: "Revise a conexão de Estoque",
    icon: false,
  },
];

export default function FontesDeDadosPage() {
  return (
    <main className="flex w-full flex-col items-start gap-6 p-8">
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col items-start gap-[6px]">
          <div className="flex items-center gap-3">
            <h1 className="whitespace-nowrap text-[28px] font-bold leading-[1.5] text-ink">
              Fontes de Dados
            </h1>
            <Chip
              size="small"
              label="Dados demonstrativos"
              sx={{
                bgcolor: "var(--color-background)",
                color: "var(--color-muted)",
                borderRadius: "6px",
              }}
            />
          </div>
          <p className="text-sm leading-[1.5] text-muted">
            Conecte, organize e mantenha os dados que alimentam suas análises.
          </p>
        </div>
        <Button variant="primary" size="md" className="shrink-0" startIcon={<Star size={16} />}>
          Adicionar fonte
        </Button>
      </div>

      <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="flex min-w-0 flex-1 flex-col items-start gap-[10px] overflow-hidden p-5"
          >
            <div className="flex w-full items-center justify-between">
              <p className="text-[13px] leading-[1.5] text-muted">{stat.title}</p>
              {stat.icon ? (
                <Database size={18} aria-hidden="true" className="text-brand" />
              ) : (
                <span aria-hidden className="size-[18px] shrink-0" />
              )}
            </div>
            <p className="text-[28px] leading-[1.5] text-brand">{stat.value}</p>
            <div className="flex items-center">
              <p className="text-xs leading-[1.5] text-muted">{stat.context}</p>
            </div>
          </Card>
        ))}
      </div>

      <FontesView />

      <div className="flex w-full flex-col items-start gap-3 rounded-lg bg-warning-bg p-4 sm:flex-row sm:items-center">
        <TriangleAlert size={18} aria-hidden="true" className="shrink-0 text-warning" />
        <p className="min-w-0 flex-1 text-xs leading-[1.5] text-warning">
          A conexão de Estoque precisa de uma nova credencial. As demais fontes
          continuam disponíveis normalmente.
        </p>
        <Button variant="subtle" size="sm" className="shrink-0 whitespace-nowrap text-warning!">
          Revisar conexão →
        </Button>
      </div>

      <PageFooter />
    </main>
  );
}
