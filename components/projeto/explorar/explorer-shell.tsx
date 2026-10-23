"use client";

import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { ChatPanel } from "./chat/chat-panel";
import { ExplorerSidebar } from "./explorer-sidebar";
import { Resizer } from "./resizer";
import { WorkspacePanel } from "./workspace-panel";
import { setWorkspaceOpen, useExplorer } from "@/lib/explorer-store";
import { initialSelectedSourceIds } from "@/lib/project-data";

const SIDEBAR_MIN = 232;
const SIDEBAR_MAX = 336;
const WORKSPACE_MIN = 440;
const WORKSPACE_MAX = 900;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

type DragState = {
  key: "sidebar" | "workspace";
  startX: number;
  startWidth: number;
};

/**
 * Workspace da aba Explorar: sidebar de contexto, conversa com o assistente e
 * área de trabalho com os resultados gerados. Painéis redimensionáveis e
 * recolhíveis em telas largas; empilhados abaixo de 1280px.
 */
export function ExplorerShell({ projectId }: { projectId: string }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedSourceIds,
  );
  const [sidebarWidth, setSidebarWidth] = useState(264);
  const [workspaceWidth, setWorkspaceWidth] = useState(620);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dragRef = useRef<DragState | null>(null);
  // `workspaceOpen` vive no store: um artefato novo a reabre no mesmo update.
  const { activeConversationId, workspaceOpen } = useExplorer();

  function toggleSource(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  }

  function beginDrag(key: DragState["key"], event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    dragRef.current = {
      key,
      startX: event.clientX,
      startWidth: key === "sidebar" ? sidebarWidth : workspaceWidth,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const delta = event.clientX - drag.startX;
    if (drag.key === "sidebar") {
      setSidebarWidth(clamp(drag.startWidth + delta, SIDEBAR_MIN, SIDEBAR_MAX));
    } else {
      // Arrastar para a esquerda amplia a área de trabalho.
      setWorkspaceWidth(clamp(drag.startWidth - delta, WORKSPACE_MIN, WORKSPACE_MAX));
    }
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const shellStyle = {
    "--sidebar-w": sidebarOpen ? `${sidebarWidth}px` : "0px",
    "--workspace-w": workspaceOpen ? `${workspaceWidth}px` : "0px",
  } as CSSProperties;

  return (
    <div
      style={shellStyle}
      className="flex w-full min-w-0 flex-col gap-3 overflow-hidden xl:h-[864px] xl:flex-row xl:gap-0"
    >
      {sidebarOpen ? (
        <aside
          aria-label="Contexto do projeto"
          className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface xl:h-full xl:w-[var(--sidebar-w)] xl:max-w-[calc(100%_-_var(--workspace-w)_-_340px)] xl:rounded-none xl:border-y-0 xl:border-l-0"
        >
          <ExplorerSidebar
            projectId={projectId}
            selectedIds={selectedIds}
            onToggle={toggleSource}
            onCollapse={() => setSidebarOpen(false)}
          />
        </aside>
      ) : (
        <div className="hidden shrink-0 flex-col items-center gap-3 border-y border-l border-line bg-surface pt-4 xl:flex xl:w-11">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir lateral do projeto"
            title="Abrir lateral do projeto"
            className="flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle-bg hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <PanelLeftOpen size={17} aria-hidden="true" />
          </button>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Contexto
          </span>
        </div>
      )}

      {sidebarOpen && (
        <Resizer
          label="Redimensionar lateral do projeto"
          onPointerDown={(event) => beginDrag("sidebar", event)}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
        />
      )}

      <section
        aria-label="Conversa com o assistente"
        className="flex h-[620px] min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-surface xl:h-full xl:rounded-none xl:border-y-0"
      >
        <ChatPanel
          key={activeConversationId}
          projectId={projectId}
          selectedIds={selectedIds}
          onToggleSource={toggleSource}
        />
      </section>

      {workspaceOpen ? (
        <>
          <Resizer
            label="Redimensionar área de trabalho"
            onPointerDown={(event) => beginDrag("workspace", event)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
          />
          <aside
            aria-label="Área de trabalho"
            className="flex min-h-[460px] w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface xl:h-full xl:min-h-0 xl:w-[var(--workspace-w)] xl:max-w-[calc(100%_-_var(--sidebar-w)_-_340px)] xl:rounded-none xl:border-y-0 xl:border-r-0"
          >
            <WorkspacePanel projectId={projectId} onCollapse={() => setWorkspaceOpen(false)} />
          </aside>
        </>
      ) : (
        <div className="hidden shrink-0 flex-col items-center gap-3 border-y border-r border-line bg-surface pt-4 xl:flex xl:w-11">
          <button
            type="button"
            onClick={() => setWorkspaceOpen(true)}
            aria-label="Abrir área de trabalho"
            title="Abrir área de trabalho"
            className="flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle-bg hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <PanelRightOpen size={17} aria-hidden="true" />
          </button>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Resultados
          </span>
        </div>
      )}
    </div>
  );
}
