"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {
  ChevronRight,
  FolderOpen,
  LayoutGrid,
  List,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "Projeto 01 — Análise comercial",
    description: "Explore vendas, clientes e metas com IA.",
    meta: "14 de jul. de 2026 · 11 fontes",
    updatedDate: "14 de jul. de 2026",
    updatedMeta: "há 3 meses",
    sources: 11,
    href: "/projetos/projeto-01",
  },
  {
    id: 2,
    title: "Metas e Indicadores 2026",
    description: "Acompanhamento de KPIs e metas anuais.",
    meta: "16 de dez. de 2025 · 40 fontes",
    updatedDate: "16 de dez. de 2025",
    updatedMeta: "há 10 meses",
    sources: 40,
    href: "/projetos/projeto-01",
  },
  {
    id: 3,
    title: "Vendas por Regional",
    description: "Desempenho de vendas segmentado por região.",
    meta: "5 de mar. de 2026 · 50 fontes",
    updatedDate: "5 de mar. de 2026",
    updatedMeta: "há 7 meses",
    sources: 50,
    href: "/projetos/projeto-01",
  },
  {
    id: 4,
    title: "Clientes e Recorrência",
    description: "Análise de retenção e Lifetime Value.",
    meta: "30 de set. de 2025 · 38 fontes",
    updatedDate: "30 de set. de 2025",
    updatedMeta: "há 12 meses",
    sources: 38,
    href: "/projetos/projeto-01",
  },
  {
    id: 5,
    title: "Estoque e Suprimentos",
    description: "Níveis de estoque, giro e rupturas.",
    meta: "30 de jan. de 2026 · 13 fontes",
    updatedDate: "30 de jan. de 2026",
    updatedMeta: "há 8 meses",
    sources: 13,
    href: "/projetos/projeto-01",
  },
  {
    id: 6,
    title: "Dashboard Financeiro",
    description: "Receita, custos e margem por período.",
    meta: "20 de mar. de 2026 · 35 fontes",
    updatedDate: "20 de mar. de 2026",
    updatedMeta: "há 7 meses",
    sources: 35,
    href: "/projetos/projeto-01",
  },
  {
    id: 7,
    title: " RH e Pessoas",
    description: "Headcount, turnover e absenteísmo.",
    meta: "10 de fev. de 2026 · 8 fontes",
    updatedDate: "10 de fev. de 2026",
    updatedMeta: "há 8 meses",
    sources: 8,
    href: "/projetos/projeto-01",
  },
  {
    id: 8,
    title: "Marketing e Aquisição",
    description: "Campanhas, canais e custo de aquisição.",
    meta: "22 de abr. de 2026 · 22 fontes",
    updatedDate: "22 de abr. de 2026",
    updatedMeta: "há 6 meses",
    sources: 22,
    href: "/projetos/projeto-01",
  },
];

export function ProjectsList() {
  const [view, setView] = useState<"grid" | "table">("grid");

  return (
    <div className="flex w-full flex-col items-start gap-5">
      <Card className="flex w-full flex-col overflow-hidden">
        <div className="flex w-full shrink-0 items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg leading-[1.5] text-ink">Todos os projetos</h2>
            <span className="rounded-md bg-background px-[9px] py-1 text-xs font-medium leading-[1.5] text-muted">
              {projects.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-border-default p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label="Ver como cards"
                aria-pressed={view === "grid"}
                className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                  view === "grid"
                    ? "bg-brand text-white"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                aria-label="Ver como tabela"
                aria-pressed={view === "table"}
                className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                  view === "table"
                    ? "bg-brand text-white"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                <List size={16} />
              </button>
            </div>
            <Button variant="primary" size="md" startIcon={<Plus size={16} />}>
              Novo projeto
            </Button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid w-full grid-cols-1 gap-4 border-t border-line p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.href}
                className="group flex h-[146px] flex-col justify-between rounded-xl border border-border-default bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-brand-accent shadow-sm"
                  >
                    <FolderOpen size={20} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-lg font-bold leading-normal text-foreground">
                      {project.title}
                    </h4>
                    <p className="mt-1 text-sm leading-[1.4] text-text-secondary">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-xs leading-[1.5] text-muted">
                    {project.meta}
                  </p>
                  <span className="shrink-0 text-sm font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    Acessar →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full min-w-0 overflow-x-auto border-t border-line">
            <div className="flex min-w-[700px] flex-col">
              <div className="flex h-[42px] w-full shrink-0 items-center gap-4 border-b border-line bg-subtle-bg px-5">
                <p className="min-w-0 flex-1 text-[11px] font-semibold leading-[1.5] text-muted">
                  NOME DO PROJETO
                </p>
                <p className="w-[140px] shrink-0 text-[11px] font-semibold leading-[1.5] text-muted">
                  FONTES
                </p>
                <p className="w-[152px] shrink-0 text-[11px] font-semibold leading-[1.5] text-muted">
                  ATUALIZAÇÃO
                </p>
                <span aria-hidden className="size-4 shrink-0" />
              </div>
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={project.href}
                  className="flex h-20 w-full shrink-0 items-center gap-4 border-b border-line px-5 transition-colors hover:bg-selection"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface">
                      <FolderOpen size={18} aria-hidden="true" className="text-brand" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.5]">
                      <p className="truncate text-sm font-semibold text-ink">
                        {project.title}
                      </p>
                      <p className="truncate text-[11px] text-muted">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <p className="w-[140px] shrink-0 text-xs leading-[1.5] text-ink">
                    {project.sources} fontes
                  </p>
                  <div className="flex w-[152px] shrink-0 flex-col gap-[3px] whitespace-nowrap leading-[1.5]">
                    <p className="text-xs text-ink">{project.updatedDate}</p>
                    <p className="text-[10px] text-muted">{project.updatedMeta}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-muted"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
