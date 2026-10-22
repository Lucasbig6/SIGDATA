"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
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
  Code,
  Database,
  FileText,
  FolderOpen,
  MoreVertical,
  Plus,
  Search,
  Star,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddSourceDialog } from "./add-source-dialog";
import { EditConnectionDialog, ReviewConnectionDialog } from "./source-dialogs";
import {
  dataSources,
  sourceDetails,
  statusOptions,
  statusStyles,
  typeOptions,
  type DataSource,
  type SourceDetails,
  type SourceStatus,
} from "@/lib/sources-data";

type DetailTab = "Visão geral" | "Campos" | "Histórico";

const tabs: DetailTab[] = ["Visão geral", "Campos", "Histórico"];

const boxIcons: Record<string, typeof Database> = {
  "icon-database-lg": Database,
  "icon-file-text": FileText,
};

const PAGE_SIZE = 5;

type Message = { tone: "success" | "error" | "info"; text: string };

function StatusBadge({ status, label }: { status: SourceStatus; label: string }) {
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
  // Primeira fonte selecionada por padrão (painel de detalhes visível).
  const [selectedId, setSelectedId] = useState<string | null>(dataSources[0].id);
  const [tab, setTab] = useState<DetailTab>("Visão geral");
  const [page, setPage] = useState(1);
  const [showAllFields, setShowAllFields] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  // Estado local das fontes: permite sincronizar/criar/remover na sessão.
  const [sources, setSources] = useState<DataSource[]>(dataSources);
  const [detailsMap, setDetailsMap] = useState<Record<string, SourceDetails>>(
    sourceDetails,
  );

  const [addOpen, setAddOpen] = useState(false);
  const [editFor, setEditFor] = useState<DataSource | null>(null);
  const [reviewFor, setReviewFor] = useState<DataSource | null>(null);
  const [menu, setMenu] = useState<{ id: string; anchor: HTMLElement } | null>(
    null,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesQuery =
        q.length === 0 ||
        source.name.toLowerCase().includes(q) ||
        source.fileLabel.toLowerCase().includes(q);
      const matchesType = typeFilter === "Todos os tipos" || source.type === typeFilter;
      const matchesStatus =
        statusFilter === "Todos os estados" || source.status === statusFilter;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [sources, query, typeFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = filtered.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const end = Math.min(safePage * PAGE_SIZE, filtered.length);
  const pageRows = filtered.slice(start - 1, end);

  const selected = selectedId
    ? (sources.find((source) => source.id === selectedId) ?? null)
    : null;
  const details = selected ? (detailsMap[selected.id] ?? null) : null;

  const allFilteredChecked =
    filtered.length > 0 && filtered.every((source) => checkedIds.includes(source.id));
  const someFilteredChecked =
    !allFilteredChecked &&
    filtered.some((source) => checkedIds.includes(source.id));

  function updateSource(id: string, patch: Partial<DataSource>) {
    setSources((prev) =>
      prev.map((source) => (source.id === id ? { ...source, ...patch } : source)),
    );
  }

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

  function selectSource(id: string) {
    setSelectedId(id);
    setTab("Visão geral");
    setShowAllFields(false);
  }

  /** Sincronização simulada: “Requer atenção” continua falhando; o resto passa. */
  function syncSource(id: string) {
    const source = sources.find((item) => item.id === id);
    if (!source) return;
    const wasFailing = source.status === "Requer atenção";
    updateSource(id, { status: "Processando", updatedMeta: "agora · Sincronização" });
    setMessage({ tone: "info", text: `Sincronizando “${source.name}”…` });
    setTimeout(() => {
      if (wasFailing) {
        updateSource(id, { status: "Requer atenção" });
        setMessage({
          tone: "error",
          text: `Falha ao sincronizar “${source.name}”. Revise a conexão.`,
        });
        return;
      }
      updateSource(id, {
        status: source.type === "PostgreSQL" ? "Conectada" : "Disponível",
        updatedMeta: "agora · Manual",
      });
      setMessage({
        tone: "success",
        text: `“${source.name}” sincronizada com sucesso (simulação).`,
      });
    }, 1600);
  }

  function handleRemove(id: string) {
    const source = sources.find((item) => item.id === id);
    setSources((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
    setMessage({
      tone: "info",
      text: `“${source?.name ?? "Fonte"}” removida nesta sessão.`,
    });
  }

  const BoxIcon = details ? (boxIcons[details.boxIcon] ?? Database) : Database;
  const selectedFields = details?.columns ?? [];
  const visibleFields = showAllFields
    ? selectedFields
    : selectedFields.slice(0, Math.min(3, selectedFields.length));

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Aviso contextual: fonte que precisa de revisão */}
      {sources.some((source) => source.status === "Requer atenção") && (
        <div className="flex w-full flex-col items-start gap-3 rounded-lg bg-warning-bg p-4 sm:flex-row sm:items-center">
          <TriangleAlert
            size={18}
            aria-hidden="true"
            className="shrink-0 text-warning"
          />
          <p className="min-w-0 flex-1 text-xs leading-[1.5] text-warning">
            A conexão de{" "}
            {sources.find((source) => source.status === "Requer atenção")?.name}{" "}
            precisa de uma nova credencial. As demais fontes continuam
            disponíveis normalmente.
          </p>
          <Button
            variant="subtle"
            size="sm"
            className="shrink-0 whitespace-nowrap text-warning!"
            onClick={() =>
              setReviewFor(
                sources.find((source) => source.status === "Requer atenção") ?? null,
              )
            }
          >
            Revisar conexão →
          </Button>
        </div>
      )}

      <div className="flex w-full flex-col items-start gap-5 lg:flex-row">
      {/* Catálogo de fontes */}
      <Card className="flex min-w-0 flex-1 flex-col overflow-hidden lg:h-[759px]">
        <div className="flex w-full shrink-0 items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg leading-[1.5] text-ink">Todas as fontes</h2>
            <span className="rounded-md bg-background px-[9px] py-1 text-xs font-medium leading-[1.5] text-muted">
              {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-[7px] sm:flex">
              <ArrowDownUp size={14} aria-hidden="true" className="text-muted" />
              <p className="text-xs leading-[1.5] text-muted">Mais recentes</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              startIcon={<Plus size={14} />}
              onClick={() => setAddOpen(true)}
            >
              Adicionar fonte
            </Button>
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center gap-[10px] px-5 pb-5">
          <TextField
            size="small"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
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
            onChange={(event) => {
              setTypeFilter(event.target.value);
              setPage(1);
            }}
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
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
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

        {message && (
          <div className="w-full px-5 pb-4">
            <Alert
              severity={
                message.tone === "error"
                  ? "error"
                  : message.tone === "success"
                    ? "success"
                    : "info"
              }
              icon={
                message.tone === "error" ? (
                  <TriangleAlert size={18} />
                ) : message.tone === "success" ? (
                  <CircleCheck size={18} />
                ) : undefined
              }
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          </div>
        )}

        <div className="w-full min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-[880px] flex-col">
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
              <span aria-hidden className="w-[148px] shrink-0" />
              <span aria-hidden className="size-4 shrink-0" />
            </div>

            {filtered.length === 0 && (
              <div className="flex h-20 w-full items-center justify-center border-b border-line bg-surface px-5">
                <p className="text-xs leading-[1.5] text-muted">
                  Nenhuma fonte corresponde aos filtros.
                </p>
              </div>
            )}

            {pageRows.map((source) => {
              const isSelected = selected?.id === source.id;
              const isChecked = checkedIds.includes(source.id);
              const statusStyle = statusStyles[source.status];
              return (
                <div
                  key={source.id}
                  onClick={() => selectSource(source.id)}
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

                  <span
                    className="flex w-[148px] shrink-0 items-center justify-end gap-1"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Button
                      href={`/fontes-de-dados/${source.id}/preparar`}
                      variant="subtle"
                      size="sm"
                      className="whitespace-nowrap text-brand!"
                      startIcon={<Code size={14} aria-hidden="true" />}
                      aria-label={`Preparar ${source.name}`}
                    >
                      Preparar
                    </Button>
                    <IconButton
                      size="small"
                      aria-label={`Mais ações de ${source.name}`}
                      onClick={(event) =>
                        setMenu({ id: source.id, anchor: event.currentTarget })
                      }
                    >
                      <MoreVertical size={16} />
                    </IconButton>
                  </span>

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

        {/* Paginação funcional */}
        <div className="flex h-[62px] w-full shrink-0 items-center justify-between px-5">
          <p className="text-xs leading-[1.5] text-muted">
            Exibindo {start}–{end} de {filtered.length} fontes
          </p>
          <div className="flex items-center gap-1">
            <IconButton
              size="small"
              disabled={safePage <= 1}
              aria-label="Página anterior"
              onClick={() => setPage(safePage - 1)}
            >
              <ChevronLeft size={16} />
            </IconButton>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (number) => (
                <button
                  key={number}
                  type="button"
                  aria-label={`Página ${number}`}
                  aria-current={number === safePage ? "page" : undefined}
                  onClick={() => setPage(number)}
                  className={`flex size-7 items-center justify-center rounded-md text-xs font-semibold leading-[1.5] transition-colors ${
                    number === safePage
                      ? "bg-selection text-brand"
                      : "text-muted hover:bg-subtle-bg"
                  }`}
                >
                  {number}
                </button>
              ),
            )}
            <IconButton
              size="small"
              disabled={safePage >= pageCount}
              aria-label="Próxima página"
              onClick={() => setPage(safePage + 1)}
            >
              <ChevronRight size={16} />
            </IconButton>
          </div>
        </div>
      </Card>

      {/* Menu "Mais ações" da linha */}
      <Menu
        anchorEl={menu?.anchor}
        open={menu !== null}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menu &&
          (() => {
            const source = sources.find((item) => item.id === menu.id);
            if (!source) return null;
            return (
              <>
                <MenuItem
                  onClick={() => {
                    selectSource(source.id);
                    setMenu(null);
                  }}
                >
                  Ver detalhes
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setEditFor(source);
                    setMenu(null);
                  }}
                >
                  Editar conexão
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    syncSource(source.id);
                    setMenu(null);
                  }}
                >
                  Sincronizar agora
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setReviewFor(source);
                    setMenu(null);
                  }}
                >
                  Revisar conexão
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleRemove(source.id);
                    setMenu(null);
                  }}
                  sx={{ color: "var(--color-error)" }}
                >
                  <Trash2 size={14} aria-hidden="true" className="mr-2" />
                  Remover fonte
                </MenuItem>
              </>
            );
          })()}
      </Menu>

      {/* Detalhes da fonte — abre ao lado apenas quando uma fonte é selecionada */}
      {selected && details && (
        <Card
          component="aside"
          aria-label={`Detalhes de ${selected.name}`}
          className="flex w-full shrink-0 flex-col overflow-hidden lg:w-[336px]"
        >
          <div className="flex w-full shrink-0 items-center justify-between p-5">
            <h2 className="text-base leading-[1.5] text-ink">
              Detalhes da fonte
            </h2>
            <IconButton
              size="small"
              aria-label="Fechar detalhes"
              onClick={() => setSelectedId(null)}
            >
              <X size={16} />
            </IconButton>
          </div>
          <div aria-hidden className="h-px w-full shrink-0 bg-line" />

          <div className="flex w-full shrink-0 flex-col items-start gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-selection">
                <BoxIcon size={23} aria-hidden="true" className="text-brand" />
              </span>
              <div className="flex min-w-0 flex-col gap-[2px] leading-[1.5]">
                <p className="truncate text-lg text-ink">{selected.name}</p>
                <p className="truncate text-xs text-muted">{details.subtitle}</p>
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
                  className="flex w-full items-start justify-between gap-3 text-xs leading-[1.5]"
                >
                  <p className="text-muted">{property.label}</p>
                  <p className="text-right font-medium text-ink">{property.value}</p>
                </div>
              ))}

            {tab === "Campos" && (
              <div className="flex w-full flex-col gap-2">
                {selectedFields.length > 0 ? (
                  <>
                    {visibleFields.map((column) => (
                      <div
                        key={column.name}
                        className="flex w-full items-center justify-between gap-3 text-xs leading-[1.5]"
                      >
                        <p className="truncate font-medium text-ink">{column.name}</p>
                        <p className="shrink-0 text-muted">{column.type}</p>
                      </div>
                    ))}
                    <p className="text-[11px] leading-[1.5] text-muted">
                      Exibindo {visibleFields.length} de {details.totalColumns}{" "}
                      campos.
                    </p>
                    <Button
                      variant="subtle"
                      size="sm"
                      className="self-start text-brand!"
                      onClick={() => setShowAllFields((current) => !current)}
                    >
                      {showAllFields
                        ? "Mostrar menos"
                        : `Ver todos os campos (${selectedFields.length})`}
                    </Button>
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
                <div className="flex w-full items-center justify-between gap-3 text-xs leading-[1.5]">
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

            {selected.status === "Requer atenção" && (
              <div className="flex w-full shrink-0 items-start gap-2 rounded-lg bg-warning-bg p-3">
                <TriangleAlert
                  size={17}
                  aria-hidden="true"
                  className="mt-px shrink-0 text-warning"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.5] text-warning">
                  <p className="text-xs font-semibold">Conexão com problema</p>
                  <p className="text-[11px]">
                    A última sincronização falhou. Revise a conexão.
                  </p>
                </div>
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => syncSource(selected.id)}
            >
              <Star size={16} aria-hidden="true" />
              Sincronizar agora
            </Button>

            <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="button"
                onClick={() => setEditFor(selected)}
                className="text-xs font-medium leading-[1.5] text-brand transition-colors hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Editar conexão →
              </button>
              <button
                type="button"
                onClick={() => setReviewFor(selected)}
                className="text-xs font-medium leading-[1.5] text-brand transition-colors hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Revisar conexão →
              </button>
            </div>
          </div>
        </Card>
      )}

      </div>

      <AddSourceDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(source, details) => {
          setSources((prev) => [source, ...prev]);
          setDetailsMap((prev) => ({ ...prev, [source.id]: details }));
          setPage(1);
          setMessage({
            tone: "success",
            text: `Fonte “${source.name}” criada com sucesso (simulação).`,
          });
          selectSource(source.id);
        }}
      />

      <EditConnectionDialog
        source={editFor}
        onClose={() => setEditFor(null)}
        onSaved={(name) => {
          if (!editFor) return;
          updateSource(editFor.id, { name });
          setMessage({
            tone: "success",
            text: `Conexão de “${name}” atualizada (simulação).`,
          });
        }}
      />

      <ReviewConnectionDialog
        source={reviewFor}
        onClose={() => setReviewFor(null)}
        onFixed={() => {
          if (!reviewFor) return;
          updateSource(reviewFor.id, {
            status: reviewFor.type === "API REST" ? "Disponível" : "Conectada",
            updatedMeta: "agora · Teste manual",
          });
        }}
      />
    </div>
  );
}
