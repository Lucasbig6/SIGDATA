"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  LayoutDashboard,
  LayoutGrid,
  List,
} from "lucide-react";
import { ProjectCard } from "./project-card";
import { FeaturedCard } from "./featured-card";
import { NewProjectButton } from "@/components/projeto/new-project-dialog";
import { useProjects } from "@/lib/projects-store";
import { recentPanels } from "@/lib/panels-data";

export function ProjectsSection() {
  const [panelsView, setPanelsView] = useState<"grid" | "list">("grid");
  const projects = useProjects();
  const featured = projects.slice(0, 5);

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
            <NewProjectButton />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {featured.map((project) => (
            <FeaturedCard
              key={project.id}
              title={project.title}
              meta={project.meta}
              href={project.href}
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
              href="/projetos/projeto-01#paineis"
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
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer">
            {recentPanels.map((panel) => (
              <ProjectCard
                key={panel.id}
                title={panel.title}
                description={panel.description}
                meta={panel.meta}
                href={`${panel.href}#paineis`}
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
                  href={`${panel.href}#paineis`}
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
