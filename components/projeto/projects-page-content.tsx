"use client";

import { useSyncExternalStore } from "react";
import Chip from "@mui/material/Chip";
import { NewProjectButton } from "./new-project-dialog";
import { ProjectsList } from "./projects-list";
import { useProjects } from "@/lib/projects-store";

const container = "mx-auto w-full max-w-[1440px] px-4 lg:px-[33px]";

/**
 * Lê `?q=` da URL sem `useSearchParams`: o conteúdo inteiro é
 * pré-renderizado (HTML completo) e o filtro é aplicado após a hidratação.
 */
function subscribeSearch(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getSearchSnapshot(): string {
  return window.location.search;
}

function getServerSearchSnapshot(): string {
  return "";
}

/** Conteúdo de /projetos — filtra pela busca vinda do header (`?q=`). */
export function ProjectsPageContent() {
  const search = useSyncExternalStore(
    subscribeSearch,
    getSearchSnapshot,
    getServerSearchSnapshot,
  );
  const query = new URLSearchParams(search).get("q")?.trim() ?? "";
  const projects = useProjects();

  return (
    <main className={`${container} flex flex-col gap-6 py-8`}>
      <div className="flex w-full flex-col gap-4">
        <h1 className="text-[28px] font-bold leading-[1.5] text-ink">
          Projetos
        </h1>
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <Chip
            size="small"
            label={`${projects.length} projetos`}
            sx={{
              bgcolor: "var(--color-background)",
              color: "var(--color-muted)",
              borderRadius: "6px",
            }}
          />
          <NewProjectButton />
        </div>
        {query && (
          <p className="text-sm leading-[1.5] text-muted">
            Buscando por <span className="font-semibold text-ink">“{query}”</span>
          </p>
        )}
      </div>

      <ProjectsList query={query} />
    </main>
  );
}
