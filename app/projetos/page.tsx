import type { Metadata } from "next";
import { PageFooter } from "@/components/layout/page-footer";
import { Button } from "@/components/ui/button";
import { ProjectsList } from "@/components/projeto/projects-list";
import Chip from "@mui/material/Chip";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Projetos | SIGDATA",
  description:
    "Gerencie todos os seus projetos de análise de dados em um só lugar.",
};

export default function ProjetosPage() {
  return (
    <main className="flex w-full flex-col items-start gap-6">
      <div className="mx-auto w-full max-w-[1439px] px-3 pt-8 lg:px-[60px]">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-[6px]">
            <div className="flex items-center gap-3">
              <h1 className="whitespace-nowrap text-[28px] font-bold leading-[1.5] text-ink">
                Projetos
              </h1>
              <Chip
                size="small"
                sx={{
                  bgcolor: "var(--color-background)",
                  color: "var(--color-muted)",
                  borderRadius: "6px",
                }}
              />
            </div>
            <p className="text-sm leading-[1.5] text-muted">
              Gerencie todos os seus projetos de análise de dados em um só lugar.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="shrink-0"
            startIcon={<Plus size={16} />}
          >
            Novo projeto
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-[50px]">
        <ProjectsList />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-[50px]">
        <PageFooter />
      </div>
    </main>
  );
}
