"use client";

import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  CheckCheck,
  Database,
  Ellipsis,
  Star,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { previewColumns, projectSources } from "@/lib/project-data";

type SourcesPanelProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function SourcesPanel({ selectedIds, onToggle }: SourcesPanelProps) {
  return (
    <Card className="flex w-full min-w-0 flex-col overflow-hidden min-[1440px]:h-full min-[1440px]:shrink-0 min-[1440px]:w-[280px]">
      <div className="flex h-16 w-full shrink-0 items-center gap-[10px] border-b border-line px-5">
        <Database size={18} aria-hidden="true" className="text-brand" />
        <p className="text-base leading-[1.5] text-ink">Fontes</p>
        <div className="flex min-w-0 flex-1 items-start justify-end">
          <p className="whitespace-nowrap text-xs leading-[1.5] text-muted">
            {projectSources.length} disponíveis
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-start gap-[14px] p-4">
        <Button variant="neutral" size="md" startIcon={<Star size={16} />}>
          Adicionar fontes
        </Button>

        <div className="flex w-full items-start justify-between whitespace-nowrap text-xs leading-[1.5]">
          <p className="text-muted">Fontes selecionadas</p>
          <p className="font-semibold text-brand">
            {selectedIds.length} de {projectSources.length}
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-2">
          {projectSources.map((source) => {
            const checked = selectedIds.includes(source.id);
            return (
              <label
                key={source.id}
                className={`flex w-full cursor-pointer items-start gap-2 rounded-lg border p-3 transition-colors ${
                  checked
                    ? "border-info-border bg-selection"
                    : "border-line bg-surface hover:bg-subtle-bg"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onChange={() => onToggle(source.id)}
                  slotProps={{ input: { "aria-label": source.name } }}
                />
                <span className="flex min-w-0 flex-1 flex-col items-start gap-[3px] pt-[7px] leading-[1.5]">
                  <span className="w-full text-xs font-semibold text-ink">
                    {source.name}
                  </span>
                  <span className="w-full text-[11px] text-muted">
                    {source.meta}
                  </span>
                </span>
                <Tooltip title="Mais ações">
                  <IconButton
                    size="small"
                    aria-label={`Mais ações de ${source.name}`}
                    onClick={(event) => event.preventDefault()}
                  >
                    <Ellipsis size={15} />
                  </IconButton>
                </Tooltip>
              </label>
            );
          })}
        </div>

        <p className="w-full text-[11px] leading-[1.5] text-muted">
          A IA consulta apenas as fontes selecionadas nesta conversa.
        </p>
      </div>

      <div aria-hidden className="h-px w-full shrink-0 bg-line" />

      <div className="flex w-full shrink-0 flex-col items-start gap-3 p-5">
        <div className="flex items-center gap-2">
          <Table2 size={16} aria-hidden="true" className="text-brand" />
          <p className="text-[13px] font-semibold leading-[1.5] text-ink">
            Vendas 2026
          </p>
        </div>
        <p className="whitespace-nowrap text-xs leading-[1.5] text-muted">
          Prévia da estrutura · 8 colunas
        </p>
        {previewColumns.map((column) => (
          <div
            key={column.name}
            className="flex w-full items-start justify-between whitespace-nowrap leading-[1.5]"
          >
            <p className="text-xs text-ink">{column.name}</p>
            <p className="text-[11px] text-muted">{column.type}</p>
          </div>
        ))}
        <button
          type="button"
          className="whitespace-nowrap text-xs font-semibold leading-[1.5] text-brand transition-colors hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Ver todos os campos →
        </button>
      </div>

      <div className="flex w-full min-h-0 flex-1 flex-col items-start justify-end gap-[6px] p-5">
        <Chip
          size="small"
          icon={<CheckCheck size={13} />}
          label="Fontes atualizadas"
          sx={{
            bgcolor: "var(--color-success-bg)",
            color: "var(--color-success)",
            borderRadius: "6px",
            "& .MuiChip-icon": { color: "inherit", marginLeft: "8px" },
          }}
        />
        <p className="whitespace-nowrap text-[11px] leading-[1.5] text-muted">
          01 out. 2026, às 08:30
        </p>
      </div>
    </Card>
  );
}
