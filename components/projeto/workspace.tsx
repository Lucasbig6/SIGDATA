"use client";

import { ExplorerShell } from "@/components/projeto/explorar/explorer-shell";

/** Aba Explorar: workspace de análise com assistente e área de trabalho. */
export function ProjectWorkspace({ projectId }: { projectId: string }) {
  return <ExplorerShell projectId={projectId} />;
}
