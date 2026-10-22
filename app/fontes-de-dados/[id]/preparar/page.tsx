import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Chip from "@mui/material/Chip";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { PageFooter } from "@/components/layout/page-footer";
import { SqlEditor } from "@/components/fontes/sql-editor";
import { dataSources, sourceDetails } from "@/lib/sources-data";

type Props = { params: Promise<{ id: string }> };

const container = "mx-auto w-full max-w-[1440px] px-4 lg:px-[33px]";

/**
 * A tela depende do `id` da fonte (params em tempo de request), então a rota
 * é bloqueante/sob demanda — permitido pelo Cache Components via `instant`.
 */
export const instant = false;

/** Pré-renderiza a tela para as fontes conhecidas do catálogo. */
export function generateStaticParams() {
  return dataSources.map((source) => ({ id: source.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const source = dataSources.find((item) => item.id === id);

  return {
    title: source
      ? `Preparar ${source.name} | SIGDATA`
      : "Preparação de dados | SIGDATA",
    description:
      "Editor SQL do analista: trate os dados da fonte e disponibilize a versão pronta no workspace do projeto.",
  };
}

export default async function PrepararFontePage({ params }: Props) {
  const { id } = await params;
  const source = dataSources.find((item) => item.id === id);

  if (!source) {
    notFound();
  }

  const details = sourceDetails[source.id];

  return (
    <main className="flex w-full flex-1 flex-col items-start gap-6">
      <header className={`${container} mt-15`}>
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-[6px]">
            <Link
              href="/fontes-de-dados"
              className="group flex items-center gap-1 text-xs leading-[1.5] text-muted transition-colors hover:text-brand"
            >
              <ArrowLeft
                size={14}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-x-0.5"
              />
              Fontes de Dados
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="whitespace-nowrap text-[28px] font-bold leading-[1.5] text-ink">
                Preparação de dados
              </h1>
              <Chip
                size="small"
                label={source.name}
                sx={{
                  bgcolor: "var(--color-selection)",
                  color: "var(--color-brand)",
                  borderRadius: "6px",
                }}
              />
              <Chip
                size="small"
                label="Somente analistas"
                icon={<ShieldCheck size={14} />}
                sx={{
                  bgcolor: "var(--color-background)",
                  color: "var(--color-muted)",
                  borderRadius: "6px",
                }}
              />
            </div>
            <p className="text-sm leading-[1.5] text-muted">
              Trate os dados com SQL e publique a versão pronta no workspace do
              projeto.
            </p>
          </div>
        </div>
      </header>

      <section
        aria-label="Editor SQL da fonte"
        className={container}
      >
        <SqlEditor source={source} details={details} />
      </section>

      <footer className={`${container} pb-8`}>
        <PageFooter />
      </footer>
    </main>
  );
}
