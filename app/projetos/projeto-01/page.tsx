import type { Metadata } from "next";
import { PageFooter } from "@/components/layout/page-footer";
import { Button } from "@/components/ui/button";
import { ProjectWorkspace } from "@/components/projeto/workspace";
import Chip from "@mui/material/Chip";
import { ChevronRight, FolderOpen, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Projeto 01 | SIGDATA",
  description:
    "Análise comercial · Explore vendas, clientes e metas com IA.",
};

export default function Projeto01Page() {
  return (
    <main className="flex w-full flex-col items-start gap-5 px-8 py-6">
      <nav
        aria-label="Caminho de navegação"
        className="flex items-center gap-2"
      >
        <p className="whitespace-nowrap text-xs leading-[1.5] text-muted">
          Projetos
        </p>
        <ChevronRight size={12} aria-hidden="true" className="text-muted" />
        <p className="whitespace-nowrap text-xs font-medium leading-[1.5] text-ink">
          Projeto 01
        </p>
      </nav>

      <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-[14px]">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand">
            <FolderOpen size={26} aria-hidden="true" className="text-on-brand" />
          </span>
          <div className="flex flex-col items-start gap-[3px]">
            <div className="flex items-center gap-3">
              <h1 className="whitespace-nowrap text-[28px] font-bold leading-[1.5] text-ink">
                Projeto 01
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
            <p className="whitespace-nowrap text-[13px] leading-[1.5] text-muted">
              Análise comercial · Explore vendas, clientes e metas com IA.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-[10px]">
          <p className="whitespace-nowrap text-[11px] leading-[1.5] text-muted">
            Todas as alterações salvas
          </p>
          <Button variant="neutral" size="md" startIcon={<Star size={16} />}>
            Compartilhar
          </Button>
          <Button variant="primary" size="md" startIcon={<Star size={16} />}>
            Abrir painel
          </Button>
        </div>
      </div>

      <ProjectWorkspace />

      <PageFooter />
    </main>
  );
}
