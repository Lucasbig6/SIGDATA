"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import { ChevronRight, FolderOpen, LayoutGrid, List, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/projects-store";
import { NewProjectButton } from "./new-project-dialog";

type ProjectsListProps = {
  /** Filtro vindo da busca do header (`/projetos?q=`). */
  query?: string;
};

export function ProjectsList({ query = "" }: ProjectsListProps) {
  const [view, setView] = useState<"grid" | "table">("grid");
  const projects = useProjects();

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? projects.filter((project) =>
        `${project.title} ${project.description} ${project.meta}`
          .toLowerCase()
          .includes(normalized),
      )
    : projects;

  return (
    <div className="flex w-full flex-col items-start gap-5">
      <Card className="flex w-full flex-col overflow-hidden">
        <div className="flex w-full shrink-0 items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <h4 className="text-base leading-[1.5] text-ink">Todos os projetos</h4>
            <span className="rounded-md bg-background px-[9px] py-1 text-xs font-medium leading-[1.5] text-muted">
              {filtered.length}
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
            <NewProjectButton size="md" className="hidden sm:inline-flex" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-3 border-t border-line px-6 py-12 text-center">
            <SearchX size={26} aria-hidden="true" className="text-muted" />
            <p className="text-sm font-semibold leading-[1.5] text-ink">
              Nenhum projeto encontrado{normalized ? ` para “${query}”` : ""}
            </p>
            <p className="max-w-[380px] text-xs leading-[1.5] text-muted">
              Tente outro termo ou crie um novo projeto para começar a explorar
              seus dados.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {normalized && (
                <Button href="/projetos" variant="subtle" size="sm">
                  Limpar busca
                </Button>
              )}
              <NewProjectButton size="sm" label="Criar projeto" />
            </div>
          </div>
        ) : view === "grid" ? (
          <div className="grid w-full grid-cols-1 gap-4 border-t border-line p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
            {filtered.map((project) => (
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
              {filtered.map((project) => (
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
