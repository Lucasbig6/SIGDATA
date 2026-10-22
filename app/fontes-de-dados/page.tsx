import type { Metadata } from "next";
import { PageFooter } from "@/components/layout/page-footer";
import { FontesView } from "@/components/fontes/fontes-view";
import { sourceStats } from "@/lib/sources-data";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import { Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Fontes de Dados | SIGDATA",
  description:
    "Conecte, organize e mantenha os dados que alimentam suas análises.",
};

const container = "mx-auto w-full max-w-[1440px] px-4 lg:px-[33px]";

export default function FontesDeDadosPage() {
  return (
    <main className="flex w-full flex-1 flex-col items-start gap-6">
      <header className={`${container} mt-15`}>
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
        </div>
      </header>

      <section aria-label="Resumo das fontes" className={container}>
        <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
          {sourceStats.map((stat) => (
            <Card
              key={stat.title}
              className="flex min-w-0 flex-1 flex-col items-start gap-[10px] overflow-hidden p-5"
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-[13px] leading-[1.5] text-muted">
                  {stat.title}
                </p>
                {stat.icon ? (
                  <Database
                    size={18}
                    aria-hidden="true"
                    className="text-brand"
                  />
                ) : (
                  <span aria-hidden className="size-[18px] shrink-0" />
                )}
              </div>
              <p className="text-[28px] leading-[1.5] text-brand">
                {stat.value}
              </p>
              <div className="flex items-center">
                <p className="text-xs leading-[1.5] text-muted">
                  {stat.context}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section aria-label="Catálogo e detalhes das fontes" className={container}>
        <FontesView />
      </section>

      <footer className={`${container} pb-8`}>
        <PageFooter />
      </footer>
    </main>
  );
}
