"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookmarkPlus,
  ChartNoAxesCombined,
  Check,
  FileText,
  PanelsTopLeft,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addAnalysis } from "@/lib/analyses-store";
import { dimensionById, metricById } from "@/lib/explore-data";
import type { Artifact, ArtifactKind } from "@/lib/explorer-store";

const kindIcon: Record<ArtifactKind, typeof ChartNoAxesCombined> = {
  grafico: ChartNoAxesCombined,
  tabela: Table2,
  resumo: FileText,
};

const kindLabel: Record<ArtifactKind, string> = {
  grafico: "Gráfico",
  tabela: "Tabela",
  resumo: "Resumo",
};

type ArtifactCardProps = {
  artifact: Artifact;
  projectId: string;
  focused: boolean;
  onAddToPanel: () => void;
};

export function ArtifactCard({
  artifact,
  projectId,
  focused,
  onAddToPanel,
}: ArtifactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [created, setCreated] = useState(false);
  const Icon = kindIcon[artifact.kind];
  const metric = metricById(artifact.metricId ?? "receita");
  const dimension = dimensionById(artifact.dimensionId ?? "regiao");
  const values = artifact.chart?.map((item) => item.value) ?? [];
  const max = values.length > 0 ? Math.max(...values) : 1;

  useEffect(() => {
    if (focused) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focused]);

  function handleSaveAnalysis() {
    addAnalysis({
      projectId,
      title: artifact.analysisTitle ?? artifact.title,
      type: artifact.kind === "tabela" ? "tabela" : "grafico",
      dataset: artifact.dataset ?? "Vendas 2026",
      dimensionId: artifact.dimensionId ?? "regiao",
      metricId: artifact.metricId ?? "receita",
    });
    setCreated(true);
  }

  return (
    <div
      ref={cardRef}
      className={`flex w-full flex-col items-start gap-3 rounded-xl border p-4 transition-shadow ${
        focused
          ? "border-brand shadow-md ring-2 ring-brand/15"
          : "border-line hover:shadow-md"
      }`}
    >
      <div className="flex w-full items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-selection">
          <Icon size={17} aria-hidden="true" className="text-brand" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-xs font-semibold leading-[1.5] text-ink">
            {artifact.title}
          </p>
          <p className="truncate text-[11px] leading-[1.5] text-muted">
            {kindLabel[artifact.kind]} · {artifact.meta}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-subtle-bg px-1.5 py-0.5 text-[10px] font-semibold leading-[1.6] text-muted">
          {artifact.origin === "chat" ? "Gerado agora" : "Inicial"}
        </span>
      </div>

      {artifact.kind === "grafico" && artifact.chart && (
        <div className="flex w-full flex-col gap-2">
          <div className="flex h-[92px] w-full items-end gap-2.5">
            {artifact.chart.map((item) => (
              <div
                key={item.label}
                className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
              >
                <div
                  className="w-full shrink-0 rounded-[3px] bg-gradient-to-r from-brand to-brand-accent"
                  style={{
                    height: `${Math.max(8, (item.value / max) * 72)}px`,
                  }}
                />
                <p className="max-w-full truncate text-[10px] leading-[1.5] text-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <p className="w-full text-[11px] leading-[1.5] text-muted">
            Colunas · {metric?.label ?? "Valor"} por{" "}
            {dimension?.label?.toLowerCase() ?? "dimensão"}
          </p>
        </div>
      )}

      {artifact.kind === "tabela" && artifact.rows && (
        <div className="flex w-full flex-col gap-1.5">
          <div className="flex w-full items-start justify-between whitespace-nowrap text-[11px] leading-[1.5] text-muted">
            <p>{dimension?.label ?? "Categoria"}</p>
            <p>{metric?.label ?? "Valor"}</p>
          </div>
          {artifact.rows.map((row) => (
            <div
              key={row.label}
              className="flex w-full items-start justify-between gap-3 border-t border-line pt-[6px] text-[11px] leading-[1.5] text-ink"
            >
              <p className="min-w-0 truncate">{row.label}</p>
              <p className="shrink-0 font-semibold">{row.value}</p>
            </div>
          ))}
          <p className="pt-1 text-[11px] leading-[1.5] text-muted">
            {artifact.rows.length}{" "}
            {artifact.rows.length === 1 ? "linha" : "linhas"} · dados fictícios
          </p>
        </div>
      )}

      {artifact.kind === "resumo" && artifact.summary && (
        <div className="flex w-full flex-col gap-1.5 rounded-lg bg-subtle-bg p-3">
          <p className="w-full text-[15px] leading-[1.5] text-ink">
            {artifact.summary.headline}
          </p>
          <p className="w-full text-xs leading-[1.5] text-muted">
            {artifact.summary.text}
          </p>
        </div>
      )}

      <div className="flex w-full flex-wrap items-center gap-2">
        {created ? (
          <p className="flex items-center gap-1.5 text-[11px] leading-[1.5] text-success">
            <Check size={14} aria-hidden="true" />
            Rascunho criado — veja a aba Análises
          </p>
        ) : (
          <Button
            variant="neutral"
            size="sm"
            startIcon={<BookmarkPlus size={14} />}
            onClick={handleSaveAnalysis}
          >
            Salvar como análise
          </Button>
        )}

        <Button
          variant="neutral"
          size="sm"
          startIcon={<PanelsTopLeft size={14} />}
          onClick={onAddToPanel}
        >
          Adicionar ao painel
        </Button>
      </div>

      <p className="w-full text-[11px] leading-[1.5] text-muted">
        Prévia ilustrativa · dados fictícios deste protótipo.
      </p>
    </div>
  );
}
