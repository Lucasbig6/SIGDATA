"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Database,
  FileText,
  FolderOpen,
  Search,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  dataSources,
  sourceDetails,
  statusOptions,
  statusStyles,
  typeOptions,
  type DataSource,
  type SourceStatus,
} from "@/lib/sources-data";

type DetailTab = "Visão geral" | "Campos" | "Histórico";

const tabs: DetailTab[] = ["Visão geral", "Campos", "Histórico"];

const boxIcons: Record<string, typeof Database> = {
  "icon-database-lg": Database,
  "icon-file-text": FileText,
};

function StatusBadge({
  status,
  label,
}: {
  status: SourceStatus;
  label: string;
}) {
  const style = statusStyles[status];
  return (
    <Chip
      size="small"
      label={label}
      sx={{ bgcolor: style.bg, color: style.fg, borderRadius: "6px" }}
    />
  );
}

function RowIconBox({ source }: { source: DataSource }) {
  if (source.rowIcon === "database") {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface">
        <Database size={18} aria-hidden="true" className="text-brand" />
      </span>
    );
  }
  if (source.rowIcon === "file") {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
        <FileText size={18} aria-hidden="true" className="text-brand" />
      </span>
    );
  }
  return <span aria-hidden className="size-9 shrink-0 rounded-lg bg-background" />;
}

export function FontesView() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("Todos os tipos");
  const [statusFilter, setStatusFilter] = useState<string>("Todos os estados");
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string>("vendas-2026");
  const [tab, setTab] = useState<DetailTab>("Visão geral");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dataSources.filter((source) => {
      const matchesQuery =
        q.length === 0 ||
        source.name.toLowerCase().includes(q) ||
        source.fileLabel.toLowerCase().includes(q);
      const matchesType = typeFilter === "Todos os tipos" || source.type === typeFilter;
      const matchesStatus =
        statusFilter === "Todos os estados" || source.status === statusFilter;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [query, typeFilter, statusFilter]);

  const selected =
    dataSources.find((source) => source.id === selectedId) ?? dataSources[0]!;
  const details = sourceDetails[selected.id]!;

  const allFilteredChecked =
    filtered.length > 0 && filtered.every((source) => checkedIds.includes(source.id));
  const someFilteredChecked =
    !allFilteredChecked &&
    filtered.some((source) => checkedIds.includes(source.id));

  function toggleAll() {
    if (allFilteredChecked) {
      setCheckedIds((prev) =>
        prev.filter((id) => !filtered.some((source) => source.id === id)),
      );
    } else {
      setCheckedIds((prev) => [
        ...new Set([...prev, ...filtered.map((source) => source.id)]),
      ]);
    }
  }

  function toggleOne(id: string) {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  const BoxIcon = boxIcons[details.boxIcon] ?? Database;

  return (
    <div className="flex w-full flex-col items-start gap-5 lg:flex-row">
      {/* Catálogo de fontes */}
      <Card className="flex min-w-0 flex-1 flex-col overflow-hidden lg:h-[759px]">
        <div className="flex w-full shrink-0 items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg leading-[1.5] text-ink">Todas as fontes</h2>
            <span className="rounded-md bg-background px-[9px] py-1 text-xs font-medium leading-[1.5] text-muted">
              {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-[7px]">
            <ArrowDownUp size={14} aria-hidden="true" className="text-muted" />
            <p className="text-xs leading-[1.5] text-muted">Mais recentes</p>
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center gap-[10px] px-5 pb-5">
          <TextField
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou conexão"
            className="min-w-0 flex-1"
            slotProps={{
              htmlInput: { type: "search", "aria-label": "Buscar fontes" },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} aria-hidden="true" className="text-muted" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            size="small"
            aria-label="Filtrar por tipo"
            className="shrink-0"
            sx={{ minWidth: 150 }}
          >
            {typeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            size="small"
            aria-label="Filtrar por estado"
            className="shrink-0"
            sx={{ minWidth: 150 }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className="w-full min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-[700px] flex-col">
            <div className="flex h-[42px] w-full shrink-0 items-center gap-4 border-y border-line bg-subtle-bg px-5">
              <Checkbox
                checked={allFilteredChecked}
                indeterminate={someFilteredChecked}
                onChange={toggleAll}
                slotProps={{
                  input: { "aria-label": "Selecionar todas as fontes listadas" },
                }}
              />
              <p className="min-w-0 flex-1 text-[11px] font-semibold leading-[1.5] text-muted">
                NOME DA FONTE
              </p>
              <p className="w-[90px] shrink-0 text-[11px] font-semibold leading-[1.5] text-muted">
                TIPO
              </p>
              <p className="w-[136px] shrink-0 text-[11px] font-semibold leading-[1.5] text-muted">
                ESTADO
              </p>
              <p className="w-[152px] shrink-0 text-[11px] font-semibold leading-[1.5] text-muted">
                ATUALIZAÇÃO
              </p>
              <span aria-hidden className="size-4 shrink-0" />
            </div>

            {filtered.length === 0 && (
              <div className="flex h-20 w-full items-center justify-center border-b border-line bg-surface px-5">
                <p className="text-xs leading-[1.5] text-muted">
                  Nenhuma fonte corresponde aos filtros.
                </p>
              </div>
            )}

            {filtered.map((source) => {
              const isSelected = source.id === selected.id;
              const isChecked = checkedIds.includes(source.id);
              const statusStyle = statusStyles[source.status];
              return (
                <div
                  key={source.id}
                  onClick={() => setSelectedId(source.id)}
                  className={`flex h-20 w-full shrink-0 cursor-pointer items-center gap-4 border-b border-line px-5 ${
                    isSelected ? "border-l-[3px] bg-selection" : "bg-surface"
                  }`}
                >
                  <span
                    className="flex shrink-0"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleOne(source.id)}
                      slotProps={{
                        input: { "aria-label": `Selecionar ${source.name}` },
                      }}
                    />
                  </span>

                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <RowIconBox source={source} />
                    <div className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.5]">
                      <p className="truncate text-sm font-semibold text-ink">
                        {source.name}
                      </p>
                      <p className="truncate text-[11px] text-muted">
                        {source.fileLabel}
                      </p>
                    </div>
                  </div>

                  <p className="w-[90px] shrink-0 text-xs leading-[1.5] text-ink">
                    {source.type}
                  </p>

                  <div className="flex w-[136px] shrink-0 items-start">
                    <Chip
                      size="small"
                      label={source.status}
                      sx={{
                        bgcolor: statusStyle.bg,
                        color: statusStyle.fg,
                        borderRadius: "6px",
                      }}
                    />
                  </div>

                  <div className="flex w-[152px] shrink-0 flex-col gap-[3px] whitespace-nowrap leading-[1.5]">
                    <p className="text-xs text-ink">{source.updatedDate}</p>
                    <p className="text-[10px] text-muted">{source.updatedMeta}</p>
                  </div>

                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className={isSelected ? "text-brand" : "text-muted"}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex h-[62px] w-full shrink-0 items-center justify-between px-5">
          <p className="text-xs leading-[1.5] text-muted">
            Exibindo {filtered.length > 0 ? 1 : 0}–{filtered.length} de{" "}
            {dataSources.length} fontes
          </p>
          <div className="flex items-center gap-1">
            <IconButton size="small" disabled aria-label="Página anterior">
              <ChevronLeft size={16} />
            </IconButton>
            <span className="flex size-7 items-center justify-center rounded-md bg-selection text-xs font-semibold leading-[1.5] text-brand">
              1
            </span>
            <IconButton size="small" disabled aria-label="Próxima página">
              <ChevronRight size={16} />
            </IconButton>
          </div>
        </div>
      </Card>

      {/* Detalhes da fonte selecionada */}
      <Card
        component="aside"
        className="flex w-full shrink-0 flex-col overflow-hidden lg:w-[336px]"
      >
          <div className="flex w-full shrink-0 items-center justify-between p-5">
            <h2 className="text-base leading-[1.5] text-ink">Detalhes da fonte</h2>
            <span aria-hidden className="size-[17px] shrink-0" />
          </div>
          <div aria-hidden className="h-px w-full shrink-0 bg-line" />

          <div className="flex w-full shrink-0 flex-col items-start gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-selection">
                <BoxIcon size={23} aria-hidden="true" className="text-brand" />
              </span>
              <div className="flex flex-col gap-[2px] whitespace-nowrap leading-[1.5]">
                <p className="text-lg text-ink">{selected.name}</p>
                <p className="text-xs text-muted">{details.subtitle}</p>
              </div>
            </div>

            <StatusBadge status={selected.status} label={details.badgeLabel} />

            <Tabs
              value={tab}
              onChange={(_, next) => setTab(next as DetailTab)}
              aria-label="Detalhes da fonte"
              className="w-full"
              sx={{ borderBottom: "1px solid", borderColor: "divider" }}
            >
              {tabs.map((item) => (
                <Tab key={item} value={item} label={item} disableRipple />
              ))}
            </Tabs>

            {tab === "Visão geral" &&
              details.properties.map((property) => (
                <div
                  key={property.label}
                  className="flex w-full items-start justify-between whitespace-nowrap text-xs leading-[1.5]"
                >
                  <p className="text-muted">{property.label}</p>
                  <p className="font-medium text-ink">{property.value}</p>
                </div>
              ))}

            {tab === "Campos" && (
              <div className="flex w-full flex-col gap-2">
                {details.columns ? (
                  <>
                    {details.columns.map((column) => (
                      <div
                        key={column.name}
                        className="flex w-full items-center justify-between gap-3 text-xs leading-[1.5]"
                      >
                        <p className="truncate font-medium text-ink">{column.name}</p>
                        <p className="shrink-0 text-muted">{column.type}</p>
                      </div>
                    ))}
                    <p className="text-[11px] leading-[1.5] text-muted">
                      Exibindo {details.columns.length} de {details.totalColumns}{" "}
                      campos.
                    </p>
                  </>
                ) : (
                  <p className="text-xs leading-[1.5] text-muted">
                    Sem estrutura de campos demonstrativa para esta fonte.
                  </p>
                )}
              </div>
            )}

            {tab === "Histórico" && (
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center justify-between gap-3 whitespace-nowrap text-xs leading-[1.5]">
                  <p className="text-ink">{selected.updatedDate}</p>
                  <p className="text-muted">{selected.updatedMeta}</p>
                </div>
              </div>
            )}

            <div aria-hidden className="h-px w-full shrink-0 bg-line" />

            {details.usedIn && (
              <div className="flex w-full shrink-0 flex-col items-start gap-[10px]">
                <p className="text-xs font-semibold leading-[1.5] text-ink">Usada em</p>
                <Link
                  href="/projetos/projeto-01"
                  className="flex w-full items-center gap-[9px] rounded-lg bg-subtle-bg p-3 transition-colors hover:bg-selection"
                >
                  <FolderOpen size={17} aria-hidden="true" className="text-brand" />
                  <p className="min-w-0 flex-1 text-xs leading-[1.5] text-ink">
                    {details.usedIn.project}
                  </p>
                  <ArrowUpRight size={15} aria-hidden="true" className="text-muted" />
                </Link>
                {details.usedIn.panel && (
                  <p className="whitespace-nowrap text-[11px] leading-[1.5] text-muted">
                    Painel vinculado: {details.usedIn.panel}
                  </p>
                )}
              </div>
            )}

            {details.quality && (
              <div className="flex w-full shrink-0 items-start gap-2 rounded-lg bg-success-bg p-3">
                <CircleCheck
                  size={17}
                  aria-hidden="true"
                  className="mt-px shrink-0 text-success"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.5] text-success">
                  <p className="text-xs font-semibold">{details.quality.title}</p>
                  <p className="text-[11px]">{details.quality.text}</p>
                </div>
              </div>
            )}

            <Button variant="primary" size="md">
              <Star size={16} aria-hidden="true" />
              Sincronizar agora
            </Button>

            <button
              type="button"
              className="text-xs font-medium leading-[1.5] text-brand transition-colors hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Editar conexão →
            </button>
          </div>
      </Card>
    </div>
  );
}
