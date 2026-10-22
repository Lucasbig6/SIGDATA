"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  LayoutDashboard,
  LayoutGrid,
  List,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import { FeaturedCard } from "./featured-card";

const featuredProjects = [
  { id: 1, title: "Projeto 01 — Análise comercial", meta: "14 de jul. de 2026 · 11 fontes" },
  { id: 2, title: "Metas e Indicadores 2026", meta: "16 de dez. de 2025 · 40 fontes" },
  { id: 3, title: "Vendas por Regional", meta: "5 de mar. de 2026 · 50 fontes" },
  { id: 4, title: "Clientes e Recorrência", meta: "30 de set. de 2025 · 38 fontes" },
  { id: 5, title: "Estoque e Suprimentos", meta: "30 de jan. de 2026 · 13 fontes" },
];

const recentPanels = [
  {
    id: 1,
    title: "Painel Comercial",
    description: "Vendas, metas e conversão por regional.",
    meta: "12 de out. de 2026 · 8 fontes",
  },
  {
    id: 2,
    title: "Painel Financeiro",
    description: "Receita, custos e margem por período.",
    meta: "10 de out. de 2026 · 5 fontes",
  },
  {
    id: 3,
    title: "Painel de Estoque",
    description: "Níveis, giro e rupturas por depósito.",
    meta: "8 de out. de 2026 · 3 fontes",
  },
];

export function ProjectsSection() {
  const [panelsView, setPanelsView] = useState<"grid" | "list">("grid");

  return (
    <>
      <section
        aria-labelledby="featured-heading"
        className="mx-auto mt-15 w-full max-w-[1440px] px-4 lg:px-[33px]"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="featured-heading"
            className="text-2xl font-bold leading-normal text-foreground"
          >
            Projetos
          </h2>
          <div className="flex items-center gap-4">
            <Link
              href="/projetos"
              className="group flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-brand"
            >
              Ver tudo
              <ChevronRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Button variant="primary" size="md" startIcon={<Plus size={16} />}>
              Novo projeto
            </Button>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {featuredProjects.map((project) => (
            <FeaturedCard
              key={project.id}
              title={project.title}
              meta={project.meta}
            />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="panels-heading"
        className="mx-auto mt-25 w-full max-w-[1440px] px-4 lg:px-[33px]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2
            id="panels-heading"
            className="text-2xl font-bold leading-normal text-foreground"
          >
            Painéis compartilhados
          </h2>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1 rounded-lg border border-border-default p-1">
              <button
                type="button"
                onClick={() => setPanelsView("grid")}
                aria-label="Ver como cards"
                aria-pressed={panelsView === "grid"}
                className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                  panelsView === "grid"
                    ? "bg-brand text-white"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPanelsView("list")}
                aria-label="Ver como lista"
                aria-pressed={panelsView === "list"}
                className={`flex size-8 items-center justify-center rounded-md transition-colors ${
                  panelsView === "list"
                    ? "bg-brand text-white"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                <List size={16} />
              </button>
            </div>
            <Link
              href="/projetos/projeto-01"
              className="group flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-brand"
            >
              Ver tudo
              <ChevronRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
        {panelsView === "grid" ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPanels.map((panel) => (
              <ProjectCard
                key={panel.id}
                title={panel.title}
                description={panel.description}
                meta={panel.meta}
                icon={<LayoutDashboard size={20} className="text-white" />}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 w-full overflow-x-auto rounded-xl border border-border-default">
            <div className="flex min-w-[600px] flex-col">
              <div className="flex h-[42px] w-full shrink-0 items-center gap-4 border-b border-line bg-subtle-bg px-5">
                <p className="min-w-0 flex-1 text-[11px] font-semibold leading-[1.5] text-muted">
                  NOME DO PAINEL
                </p>
                <p className="hidden w-[160px] shrink-0 text-[11px] font-semibold leading-[1.5] text-muted sm:block">
                  DESCRIÇÃO
                </p>
                <p className="w-[152px] shrink-0 text-[11px] font-semibold leading-[1.5] text-muted">
                  ATUALIZAÇÃO
                </p>
                <span aria-hidden className="size-4 shrink-0" />
              </div>
              {recentPanels.map((panel) => (
                <Link
                  key={panel.id}
                  href="/projetos/projeto-01"
                  className="flex h-[72px] w-full shrink-0 items-center gap-4 border-b border-line px-5 transition-colors last:border-b-0 hover:bg-selection"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-accent shadow-sm">
                      <LayoutDashboard size={18} className="text-white" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.5]">
                      <p className="truncate text-sm font-semibold text-ink">
                        {panel.title}
                      </p>
                      <p className="truncate text-[11px] text-muted">
                        {panel.description}
                      </p>
                    </div>
                  </div>
                  <p className="hidden w-[160px] shrink-0 truncate text-xs leading-[1.5] text-ink sm:block">
                    {panel.description}
                  </p>
                  <p className="w-[152px] shrink-0 text-xs leading-[1.5] text-ink">
                    {panel.meta}
                  </p>
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
