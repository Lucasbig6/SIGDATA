"use client";

import { useState } from "react";
import { SourcesPanel } from "@/components/projeto/sources-panel";
import { AnalysisChat } from "@/components/projeto/analysis-chat";
import { ResultsPanel } from "@/components/projeto/results-panel";
import { initialSelectedSourceIds } from "@/lib/project-data";

export function ProjectWorkspace() {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedSourceIds,
  );

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-5 min-[1440px]:h-[864px] min-[1440px]:flex-row min-[1440px]:gap-[21px]">
      <SourcesPanel selectedIds={selectedIds} onToggle={toggle} />
      <AnalysisChat selectedCount={selectedIds.length} />
      <ResultsPanel />
    </div>
  );
}
