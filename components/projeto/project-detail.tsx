"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/projects-store";
import { AnalysesPanel } from "./analyses-panel";
import { ExplorePanel } from "./explore-panel";
import { PanelsPanel } from "./panels-panel";
import { ShareDialog } from "./share-dialog";
import { ProjectWorkspace } from "./workspace";

const container = "mx-auto w-full max-w-[1440px] px-4 lg:px-[33px]";

export type ProjectTab = "explorar" | "analises" | "paineis";

/** Abas contextuais do projeto (nav global enxuta, conforme briefing). */
const tabs: { value: ProjectTab; label: string }[] = [
  { value: "explorar", label: "Explorar" },
  { value: "analises", label: "Análises" },
  { value: "paineis", label: "Painéis" },
];

/** Observa o hash da URL (ex.: cards de painéis da home abrem em #paineis). */
function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function getHashSnapshot() {
  return window.location.hash.replace("#", "");
}

function getServerHashSnapshot() {
  return "";
}

export function ProjectDetail({ projectId }: { projectId: string }) {
  const projects = useProjects();
  const project = projects.find((item) => item.id === projectId);

  const hash = useSyncExternalStore(
    subscribeHash,
    getHashSnapshot,
    getServerHashSnapshot,
  );
  const [selectedTab, setSelectedTab] = useState<ProjectTab | null>(null);
  const tab: ProjectTab =
    selectedTab ??
    (tabs.some((item) => item.value === hash)
      ? (hash as ProjectTab)
      : "explorar");
  const [shareOpen, setShareOpen] = useState(false);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex w-full flex-col gap-6 pb-12 pt-8">
      <div className={container}>
        {/* Cabeçalho com breadcrumb e ações */}
        <div className="flex w-full flex-col gap-4">
          <nav
            aria-label="Trilha de navegação"
            className="flex items-center gap-1.5 text-xs leading-[1.5] text-muted"
          >
            <Link href="/projetos" className="transition-colors hover:text-ink">
              Projetos
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="truncate text-ink">{project.title}</span>
          </nav>

          <div className="flex w-full flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="text-[28px] font-bold leading-[1.5] text-ink">
                {project.title}
              </h1>
              <p className="text-sm leading-[1.5] text-muted">
                {project.description} · {project.meta}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Button
                variant="neutral"
                size="md"
                startIcon={<Share2 size={16} />}
                onClick={() => setShareOpen(true)}
              >
                Compartilhar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedTab("paineis")}
              >
                Abrir painel
              </Button>
            </div>
          </div>
        </div>

        {/* Abas contextuais */}
        <Tabs
          value={tab}
          onChange={(_event, next: ProjectTab) => setSelectedTab(next)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="Seções do projeto"
          className="mt-2 border-b border-line"
          sx={{
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
            },
          }}
        >
          {tabs.map((item) => (
            <Tab key={item.value} value={item.value} label={item.label} />
          ))}
        </Tabs>
      </div>

      {/* Conteúdo da aba ativa */}
      {tab === "explorar" && (
        <div className={`${container} flex flex-col gap-6`}>
          <ProjectWorkspace />
          <ExplorePanel projectId={projectId} />
        </div>
      )}

      {tab === "analises" && (
        <div className={container}>
          <AnalysesPanel projectId={projectId} />
        </div>
      )}

      {tab === "paineis" && (
        <div className={container}>
          <PanelsPanel projectId={projectId} />
        </div>
      )}

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={project.title}
        projectId={project.id}
      />
    </main>
  );
}
