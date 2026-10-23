"use client";

import type { ReactNode } from "react";
import {
  ChartNoAxesCombined,
  Database,
  MessageSquarePlus,
  MessagesSquare,
  PanelLeftClose,
  PanelsTopLeft,
  Sparkles,
} from "lucide-react";
import { SourceChecklist, SourcesSyncStatus } from "./source-controls";
import { useAnalyses } from "@/lib/analyses-store";
import { useExplorer, createConversation, selectConversation } from "@/lib/explorer-store";
import { useProjectPanels } from "@/lib/panels-store";

type SidebarProps = {
  projectId: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onCollapse: () => void;
};

function SectionHeader({
  title,
  count,
  action,
}: {
  title: string;
  count?: number;
  action?: ReactNode;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {title}
      </p>
      <div className="flex items-center gap-2">
        {typeof count === "number" && (
          <span className="rounded-md bg-background px-[7px] py-px text-[11px] font-medium leading-[1.6] text-muted">
            {count}
          </span>
        )}
        {action}
      </div>
    </div>
  );
}

const navItem =
  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium leading-[1.5] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function ExplorerSidebar({
  projectId,
  selectedIds,
  onToggle,
  onCollapse,
}: SidebarProps) {
  const { conversations, activeConversationId } = useExplorer();
  const analyses = useAnalyses().filter((item) => item.projectId === projectId);
  const panels = useProjectPanels().filter((item) => item.projectId === projectId);

  return (
    <>
      <div className="flex h-14 w-full shrink-0 items-center justify-between gap-2 border-b border-line px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles size={16} aria-hidden="true" className="shrink-0 text-brand" />
          <p className="truncate text-sm font-semibold leading-[1.5] text-ink">
            Explorar com IA
          </p>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Recolher lateral"
          title="Recolher lateral"
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle-bg hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <PanelLeftClose size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="flex w-full min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
        <nav aria-label="Seções do projeto" className="flex w-full flex-col gap-1">
          <SectionHeader title="Projeto" />
          <span
            aria-current="page"
            className={`${navItem} bg-selection text-brand`}
          >
            <Sparkles size={15} aria-hidden="true" />
            Explorar
          </span>
          <a href="#analises" className={`${navItem} text-ink hover:bg-subtle-bg`}>
            <ChartNoAxesCombined size={15} aria-hidden="true" className="text-muted" />
            Análises
            <span className="ml-auto rounded-md bg-background px-[7px] py-px text-[11px] font-medium text-muted">
              {analyses.length}
            </span>
          </a>
          <a href="#paineis" className={`${navItem} text-ink hover:bg-subtle-bg`}>
            <PanelsTopLeft size={15} aria-hidden="true" className="text-muted" />
            Painéis
            <span className="ml-auto rounded-md bg-background px-[7px] py-px text-[11px] font-medium text-muted">
              {panels.length}
            </span>
          </a>
        </nav>

        <div className="flex w-full flex-col gap-2">
          <SectionHeader
            title="Conversas"
            count={conversations.length}
            action={
              <button
                type="button"
                onClick={() => createConversation()}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold leading-[1.5] text-brand transition-colors hover:bg-selection focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <MessageSquarePlus size={13} aria-hidden="true" />
                Nova
              </button>
            }
          />
          <div className="flex w-full flex-col gap-1">
            {conversations.map((conversation) => {
              const active = conversation.id === activeConversationId;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => selectConversation(conversation.id)}
                  aria-current={active ? "true" : undefined}
                  className={`flex w-full items-start gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    active
                      ? "border-info-border bg-selection"
                      : "border-transparent hover:bg-subtle-bg"
                  }`}
                >
                  <MessagesSquare
                    size={14}
                    aria-hidden="true"
                    className={`mt-0.5 shrink-0 ${active ? "text-brand" : "text-muted"}`}
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={`truncate text-xs font-semibold leading-[1.5] ${active ? "text-brand" : "text-ink"}`}
                    >
                      {conversation.title}
                    </span>
                    <span className="text-[11px] leading-[1.5] text-muted">
                      {conversation.time} · {conversation.messages.length}{" "}
                      {conversation.messages.length === 1 ? "mensagem" : "mensagens"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <SectionHeader title="Análises salvas" count={analyses.length} />
          <div className="flex w-full flex-col gap-1">
            {analyses.slice(0, 4).map((analysis) => (
              <a
                key={analysis.id}
                href="#analises"
                className="group flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-subtle-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <ChartNoAxesCombined
                  size={13}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-brand"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs leading-[1.5] text-ink">
                    {analysis.title}
                  </span>
                  <span className="text-[11px] leading-[1.5] text-muted">
                    {analysis.published ? "Publicada" : "Rascunho"} · {analysis.updatedAt}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <SectionHeader title="Painéis" count={panels.length} />
          <div className="flex w-full flex-col gap-1">
            {panels.map((panel) => (
              <a
                key={panel.id}
                href="#paineis"
                className="group flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-subtle-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <PanelsTopLeft
                  size={13}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-brand"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs leading-[1.5] text-ink">
                    {panel.title}
                  </span>
                  <span className="text-[11px] leading-[1.5] text-muted">
                    {panel.status === "publicado" ? "Publicado" : "Rascunho"} ·{" "}
                    {panel.widgets.length}{" "}
                    {panel.widgets.length === 1 ? "widget" : "widgets"}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <SectionHeader
            title="Fontes"
            count={selectedIds.length}
          />
          <p className="-mt-1 flex items-center gap-1.5 text-[11px] leading-[1.5] text-muted">
            <Database size={12} aria-hidden="true" />
            Contexto enviado ao assistente
          </p>
          <SourceChecklist selectedIds={selectedIds} onToggle={onToggle} dense />
        </div>
      </div>

      <div className="w-full shrink-0 border-t border-line p-4">
        <SourcesSyncStatus />
      </div>
    </>
  );
}
