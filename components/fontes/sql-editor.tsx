"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Brackets,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Columns3,
  Database,
  FileText,
  Folder,
  FolderOpen,
  Play,
  Plus,
  RefreshCw,
  Rows3,
  Search,
  Share2,
  Square,
  Table2,
  Terminal,
  X,
} from "lucide-react";
import {
  statusStyles,
  type DataSource,
  type SourceDetails,
} from "@/lib/sources-data";

type Column = { name: string; type: string };

type QueryTab = {
  id: string;
  name: string;
  sql: string;
  ranSql: string | null;
  ranMs: number | null;
};

const fallbackColumns: Column[] = [
  { name: "id", type: "Identificador" },
  { name: "nome", type: "Texto" },
  { name: "atualizado_em", type: "Data" },
];

const dateSamples = [
  "01 out. 2026",
  "30 set. 2026",
  "29 set. 2026",
  "28 set. 2026",
  "27 set. 2026",
];

const moneySamples = [
  "R$ 48.320,10",
  "R$ 39.875,40",
  "R$ 31.204,90",
  "R$ 27.660,00",
  "R$ 22.915,75",
];

const textSamples = ["Sudeste", "Nordeste", "Sul", "Centro-Oeste", "Norte"];

const previewRows = [0, 1, 2, 3, 4];

const rowLimitOptions = ["100", "200", "500", "1000"];

function demoValue(column: Column, row: number) {
  switch (column.type) {
    case "Data":
      return dateSamples[row] ?? "—";
    case "Moeda":
      return moneySamples[row] ?? "—";
    case "Identificador":
      return `#${1042 + row}`;
    case "Texto":
      return textSamples[row] ?? "—";
    default:
      return `${column.name}_${row + 1}`;
  }
}

function buildInitialQuery(tableName: string, columns: Column[], name: string) {
  const fields = columns.map((column) => `  ${column.name}`).join(",\n");
  return `-- ${name}: tratamento antes de disponibilizar no workspace\nSELECT\n${fields}\nFROM ${tableName}\nLIMIT 100;`;
}

function formatSql(sql: string) {
  const keywords =
    /\b(select|from|where|limit|group\s+by|order\s+by|left\s+join|inner\s+join|join|and|or|as|on)\b/gi;
  return sql
    .replace(keywords, (word) => word.toUpperCase())
    .replace(/[ \t]+$/gm, "");
}

function clock() {
  return new Date().toLocaleTimeString("pt-BR", { hour12: false });
}

function ExplorerRow({
  depth,
  icon,
  label,
  meta,
  expandable,
  expanded,
  onToggle,
  onClick,
  title,
}: {
  depth: number;
  icon: ReactNode;
  label: string;
  meta?: string;
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <div
      style={{ paddingLeft: 8 + depth * 14 }}
      className="flex w-full items-center gap-1.5 py-[3px] pr-2 transition-colors hover:bg-selection"
    >
      {expandable ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label={`${expanded ? "Recolher" : "Expandir"} ${label}`}
          className="flex w-3 shrink-0 justify-center text-muted hover:text-ink"
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
      ) : (
        <span aria-hidden className="w-3 shrink-0" />
      )}
      <button
        type="button"
        onClick={onClick ?? onToggle}
        title={title}
        className="flex min-w-0 flex-1 items-center gap-1.5 text-left text-xs leading-[1.5] text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
      >
        <span className="flex shrink-0 items-center text-brand">{icon}</span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {meta && (
          <span className="shrink-0 text-[10px] leading-[1.5] text-muted">
            {meta}
          </span>
        )}
      </button>
    </div>
  );
}

export function SqlEditor({
  source,
  details,
}: {
  source: DataSource;
  details?: SourceDetails;
}) {
  const tableName =
    details?.properties.find(
      (property) => property.label === "Tabela de origem",
    )?.value ?? source.id.replace(/-/g, "_");

  const columns = details?.columns ?? fallbackColumns;
  const totalRecords =
    details?.properties.find((property) => property.label === "Registros")
      ?.value ?? "—";

  const initialQuery = buildInitialQuery(tableName, columns, source.name);

  const [tabs, setTabs] = useState<QueryTab[]>([
    {
      id: "1",
      name: "consulta.sql",
      sql: initialQuery,
      ranSql: initialQuery,
      ranMs: 42,
    },
  ]);
  const [activeId, setActiveId] = useState("1");
  const [running, setRunning] = useState(false);
  const [resultTab, setResultTab] = useState<"resultado" | "mensagens">(
    "resultado",
  );
  const [messages, setMessages] = useState<string[]>([
    `Conectado · ${source.type} · ${source.name}`,
    `Objetos carregados em ${tableName}`,
  ]);
  const [published, setPublished] = useState(false);
  const [rowLimit, setRowLimit] = useState("200");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState({
    connection: true,
    tables: true,
    table: false,
  });
  const [cursor, setCursor] = useState({ line: 1, col: 1 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  // Linhas iniciais sem horário de propósito: `new Date()` no primeiro render
  // derruba o prerender estático do Cache Components ("Render in Browser").
  // As ações do analista (Executar, Formatar, Publicar) carimbam o horário.

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0]!;
  const sql = activeTab.sql;
  const lineCount = useMemo(() => sql.split("\n").length, [sql]);
  const isStale = activeTab.ranSql !== null && activeTab.ranSql !== sql;
  const statusStyle = statusStyles[source.status];
  const connectionIcon =
    source.rowIcon === "file" ? <FileText size={14} /> : <Database size={14} />;

  const query = filter.trim().toLowerCase();
  const visibleColumns =
    query.length === 0
      ? columns
      : columns.filter((column) => column.name.toLowerCase().includes(query));
  const tableMatches =
    query.length === 0 || tableName.toLowerCase().includes(query);
  const tableOpen = query.length > 0 || open.table;
  const hasObjects = tableMatches || visibleColumns.length > 0;

  function updateSql(next: string) {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === activeId ? { ...tab, sql: next } : tab)),
    );
  }

  function log(message: string) {
    setMessages((prev) => [...prev, `[${clock()}] ${message}`]);
  }

  function runQuery() {
    if (running) {
      return;
    }
    const runFor = activeId;
    setRunning(true);
    setResultTab("mensagens");
    log(`Executando consulta em ${source.name}…`);
    timerRef.current = window.setTimeout(() => {
      const ms = 36 + Math.floor(Math.random() * 40);
      setRunning(false);
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === runFor ? { ...tab, ranSql: tab.sql, ranMs: ms } : tab,
        ),
      );
      log("Consulta executada com sucesso");
      log(`5 linhas retornadas em ${ms} ms (limite ${rowLimit})`);
      setResultTab("resultado");
    }, 650);
  }

  function stopQuery() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setRunning(false);
    log("Execução interrompida pelo analista");
  }

  function checkSyntax() {
    const valid = /\bselect\b/i.test(sql) && /\bfrom\b/i.test(sql);
    log(
      valid
        ? "Sintaxe verificada — nenhum erro encontrado (demonstrativo)"
        : "Verificação: a consulta precisa de SELECT e FROM (demonstrativo)",
    );
    setResultTab("mensagens");
  }

  function insertText(text: string) {
    const element = textareaRef.current;
    const position = element?.selectionStart ?? sql.length;
    const next = `${sql.slice(0, position)}${text}${sql.slice(position)}`;
    updateSql(next);
    window.requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(position + text.length, position + text.length);
      syncCursor();
    });
  }

  function syncCursor() {
    const element = textareaRef.current;
    if (!element) {
      return;
    }
    const upto = element.value.slice(0, element.selectionStart);
    const lines = upto.split("\n");
    setCursor({ line: lines.length, col: lines[lines.length - 1].length + 1 });
  }

  function syncScroll(event: UIEvent<HTMLTextAreaElement>) {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  }

  function addTab() {
    const id = String(Date.now());
    const name = `consulta_${tabs.length + 1}.sql`;
    setTabs((prev) => [
      ...prev,
      { id, name, sql: "-- nova consulta\nSELECT *\nFROM " + tableName + ";", ranSql: null, ranMs: null },
    ]);
    setActiveId(id);
  }

  function closeTab(id: string) {
    if (tabs.length === 1) {
      return;
    }
    const remaining = tabs.filter((tab) => tab.id !== id);
    setTabs(remaining);
    if (id === activeId) {
      setActiveId(remaining[remaining.length - 1]!.id);
    }
  }

  const resultStatus = running
    ? "Executando…"
    : activeTab.ranSql === null
      ? "Execute a consulta (F5)"
      : isStale
        ? "Consulta alterada — execute novamente"
        : `5 de ${totalRecords} linhas · ${activeTab.ranMs} ms`;

  return (
    <Card className="flex w-full flex-col overflow-hidden lg:h-[759px]">
      {/* Toolbar de execução */}
      <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line px-2 py-2">
        <div className="flex items-center gap-1">
          <IconButton
            size="small"
            title="Executar (F5 / Ctrl+Enter)"
            aria-label="Executar consulta"
            disabled={running}
            onClick={runQuery}
          >
            <Play size={15} />
          </IconButton>
          <IconButton
            size="small"
            title="Parar execução"
            aria-label="Parar execução"
            disabled={!running}
            onClick={stopQuery}
          >
            <Square size={13} />
          </IconButton>

          <span aria-hidden className="mx-1 h-5 w-px bg-line" />

          <IconButton
            size="small"
            title="Formatar SQL"
            aria-label="Formatar SQL"
            onClick={() => {
              updateSql(formatSql(sql));
              log("Consulta formatada");
            }}
          >
            <Brackets size={15} />
          </IconButton>
          <IconButton
            size="small"
            title="Verificar sintaxe"
            aria-label="Verificar sintaxe"
            onClick={checkSyntax}
          >
            <Check size={15} />
          </IconButton>

          <span aria-hidden className="mx-1 h-5 w-px bg-line" />

          <span className="text-[11px] leading-[1.5] text-muted">
            Limite de linhas
          </span>
          <Select
            size="small"
            value={rowLimit}
            onChange={(event) => setRowLimit(event.target.value)}
            aria-label="Limite de linhas"
            sx={{ minWidth: 76, height: 28 }}
          >
            {rowLimitOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-3">
          {published ? (
            <>
              <Chip
                size="small"
                icon={<CircleCheck size={13} />}
                label="Disponibilizado"
                sx={{
                  bgcolor: "var(--color-success-bg)",
                  color: "var(--color-success)",
                  borderRadius: "6px",
                }}
              />
              <Link
                href="/projetos/projeto-01"
                className="group flex items-center gap-1 text-xs leading-[1.5] text-brand transition-colors hover:text-brand-accent"
              >
                Abrir workspace
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-y-0.5"
                />
              </Link>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              startIcon={<Share2 size={14} aria-hidden="true" />}
              onClick={() => {
                setPublished(true);
                log("Versão preparada disponibilizada no workspace do Projeto 01");
              }}
            >
              Disponibilizar no workspace
            </Button>
          )}
        </div>
      </div>

      {/* Abas de consulta */}
      <div className="flex h-9 w-full shrink-0 items-end gap-1 border-b border-line bg-subtle-bg px-2 pt-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <div
              key={tab.id}
              className={`flex h-7 items-center gap-1 rounded-t-md pr-1 text-xs leading-[1.5] ${
                isActive
                  ? "border-t-2 border-brand bg-background font-medium text-ink"
                  : "border-t-2 border-transparent text-muted hover:bg-selection"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveId(tab.id)}
                className="flex h-full items-center gap-1.5 pl-3"
              >
                <FileText size={12} aria-hidden="true" />
                {tab.name}
              </button>
              {tabs.length > 1 && (
                <button
                  type="button"
                  aria-label={`Fechar ${tab.name}`}
                  onClick={() => closeTab(tab.id)}
                  className="flex size-5 items-center justify-center rounded text-muted hover:bg-surface hover:text-ink"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          );
        })}

        <IconButton
          size="small"
          aria-label="Nova consulta"
          title="Nova consulta"
          onClick={addTab}
        >
          <Plus size={14} />
        </IconButton>

        <span className="ml-auto hidden pb-1 text-[10px] leading-[1.5] text-muted sm:block">
          F5 ou Ctrl+Enter executa
        </span>
      </div>

      {/* Área principal: explorador + editor + resultados */}
      <div className="flex min-h-0 w-full flex-1 flex-col lg:flex-row">
        {/* Explorador de banco (estilo Database Navigator) */}
        <aside
          aria-label="Explorador de banco"
          className="flex h-[220px] w-full shrink-0 flex-col border-b border-line lg:h-auto lg:w-[240px] lg:border-b-0 lg:border-r"
        >
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-line bg-subtle-bg px-2">
            <p className="text-[11px] font-semibold leading-[1.5] text-ink">
              Explorador de banco
            </p>
            <button
              type="button"
              aria-label="Atualizar objetos"
              title="Atualizar objetos"
              onClick={() => log(`Objetos de ${tableName} atualizados`)}
              className="flex size-5 items-center justify-center rounded text-muted hover:bg-surface hover:text-ink"
            >
              <RefreshCw size={12} />
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 border-b border-line px-2 py-1.5">
            <Search size={13} aria-hidden="true" className="shrink-0 text-muted" />
            <input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Filtrar objetos"
              aria-label="Filtrar objetos do banco"
              className="w-full min-w-0 bg-transparent text-xs leading-[1.5] text-ink outline-none placeholder:text-muted"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto py-1">
            <ExplorerRow
              depth={0}
              icon={connectionIcon}
              label={source.name}
              meta={source.type}
              expandable
              expanded={open.connection}
              onToggle={() => setOpen((prev) => ({ ...prev, connection: !prev.connection }))}
              onClick={() => setOpen((prev) => ({ ...prev, connection: !prev.connection }))}
              title="Conexão da fonte"
            />

            {open.connection && (
              <>
                <ExplorerRow
                  depth={1}
                  icon={open.tables ? <FolderOpen size={13} /> : <Folder size={13} />}
                  label="Tabelas"
                  expandable
                  expanded={open.tables}
                  onToggle={() => setOpen((prev) => ({ ...prev, tables: !prev.tables }))}
                  onClick={() => setOpen((prev) => ({ ...prev, tables: !prev.tables }))}
                />

                {open.tables && (
                  <>
                    {tableMatches && (
                      <ExplorerRow
                        depth={2}
                        icon={<Table2 size={13} />}
                        label={tableName}
                        expandable={columns.length > 0}
                        expanded={tableOpen}
                        onToggle={() =>
                          setOpen((prev) => ({ ...prev, table: !prev.table }))
                        }
                        onClick={() => insertText(tableName)}
                        title="Clique para inserir o nome da tabela na consulta"
                      />
                    )}

                    {tableOpen &&
                      (columns.length > 0 ? (
                        visibleColumns.map((column) => (
                          <ExplorerRow
                            key={column.name}
                            depth={3}
                            icon={<Columns3 size={12} />}
                            label={column.name}
                            meta={column.type}
                            onClick={() => insertText(column.name)}
                            title="Clique para inserir o campo na consulta"
                          />
                        ))
                      ) : (
                        <p className="px-3 py-1 text-[10px] leading-[1.5] text-muted">
                          Sem campos demonstrativos para esta fonte.
                        </p>
                      ))}

                    {!hasObjects && (
                      <p className="px-3 py-1 text-[10px] leading-[1.5] text-muted">
                        Nenhum objeto corresponde ao filtro.
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Editor + resultados */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-[220px] flex-1 overflow-hidden">
            <div
              ref={gutterRef}
              aria-hidden
              className="h-full w-11 shrink-0 overflow-hidden border-r border-line bg-subtle-bg py-3 text-right font-mono text-[13px] leading-5 text-muted"
            >
              {Array.from({ length: lineCount }, (_, index) => (
                <div key={index} className="pr-2">
                  {index + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={sql}
              onChange={(event) => {
                updateSql(event.target.value);
                syncCursor();
              }}
              onScroll={syncScroll}
              onSelect={syncCursor}
              onClick={syncCursor}
              onKeyDown={(event) => {
                if (event.key === "F5" || (event.ctrlKey && event.key === "Enter")) {
                  event.preventDefault();
                  runQuery();
                }
              }}
              spellCheck={false}
              wrap="off"
              aria-label={`Editor SQL de ${source.name}`}
              placeholder={`-- escreva sua consulta sobre ${tableName}`}
              className="h-full min-w-0 flex-1 resize-none bg-transparent p-3 font-mono text-[13px] leading-5 text-ink caret-brand outline-none placeholder:text-muted"
            />
          </div>

          <div className="flex h-[264px] w-full shrink-0 flex-col border-t border-line">
            <div className="flex h-8 shrink-0 items-center gap-1 border-b border-line bg-subtle-bg px-2">
              <button
                type="button"
                onClick={() => setResultTab("resultado")}
                className={`flex h-full items-center gap-1.5 border-b-2 px-3 text-[11px] font-medium leading-[1.5] ${
                  resultTab === "resultado"
                    ? "border-brand text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <Rows3 size={12} aria-hidden="true" />
                Resultado
              </button>
              <button
                type="button"
                onClick={() => setResultTab("mensagens")}
                className={`flex h-full items-center gap-1.5 border-b-2 px-3 text-[11px] font-medium leading-[1.5] ${
                  resultTab === "mensagens"
                    ? "border-brand text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <Terminal size={12} aria-hidden="true" />
                Mensagens
                <span className="rounded bg-surface px-1 text-[10px] text-muted">
                  {messages.length}
                </span>
              </button>

              <span
                role="status"
                className="ml-auto truncate pr-1 text-[10px] leading-[1.5] text-muted"
              >
                {resultStatus}
              </span>
            </div>

            {resultTab === "resultado" ? (
              <div className="min-h-0 flex-1 overflow-auto">
                <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 w-10 border-b border-r border-line bg-subtle-bg px-2 py-1.5 text-[10px] font-semibold leading-[1.5] text-muted"
                      >
                        #
                      </th>
                      {columns.map((column) => (
                        <th
                          key={column.name}
                          scope="col"
                          title={column.type}
                          className="sticky top-0 z-10 border-b border-line bg-subtle-bg px-3 py-1.5 text-[11px] font-semibold leading-[1.5] text-ink"
                        >
                          <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                            {column.name}
                            <span className="text-[9px] font-normal text-muted">
                              {column.type}
                            </span>
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row) => (
                      <tr key={row} className="hover:bg-selection">
                        <td className="border-b border-r border-line bg-subtle-bg px-2 py-1.5 text-right text-[10px] leading-[1.5] text-muted">
                          {row + 1}
                        </td>
                        {columns.map((column) => (
                          <td
                            key={column.name}
                            className="border-b border-line px-3 py-1.5 font-mono text-[11px] leading-[1.5] whitespace-nowrap text-ink"
                          >
                            {demoValue(column, row)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[10px] leading-[1.5] text-muted">
                  <span>
                    Exibindo 5 de {totalRecords} linhas · limite {rowLimit}
                  </span>
                  <span>Células somente leitura no modo demonstrativo</span>
                </div>
              </div>
            ) : (
              <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-[11px] leading-5">
                {messages.map((message, index) => (
                  <p
                    key={`${index}-${message}`}
                    className={
                      /sucesso|disponibilizada|formatada|verificada/i.test(message)
                        ? "text-success"
                        : /interrompida|precisa/i.test(message)
                          ? "text-warning"
                          : "text-muted"
                    }
                  >
                    {message}
                  </p>
                ))}
                {running && <p className="text-brand">…</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de status */}
      <div className="flex h-8 w-full shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line bg-subtle-bg px-3 text-[11px] leading-[1.5] text-muted">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ background: statusStyle.fg }}
            />
            {source.status}
          </span>
          <span className="flex min-w-0 items-center gap-1.5">
            <Database size={12} aria-hidden="true" className="shrink-0" />
            <span className="truncate">
              {source.name} · {tableName}
            </span>
          </span>
          <span className="hidden sm:inline">Dialeto: {source.type}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Ln {cursor.line}, Col {cursor.col}
          </span>
          <span>{lineCount} linhas</span>
          <span className="hidden sm:inline">UTF-8</span>
        </div>
      </div>
    </Card>
  );
}
