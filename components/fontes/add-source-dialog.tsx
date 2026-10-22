"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { CircleCheck, Database, FileText, Table2 } from "lucide-react";
import type { DataSource, SourceDetails, SourceType } from "@/lib/sources-data";

type Kind = "banco" | "csv" | "xlsx";

const kindOptions: {
  value: Kind;
  label: string;
  description: string;
  type: SourceType;
  icon: React.ReactNode;
}[] = [
  {
    value: "banco",
    label: "Conectar banco de dados",
    description: "PostgreSQL, MySQL… (simulado)",
    type: "PostgreSQL",
    icon: <Database size={20} aria-hidden="true" />,
  },
  {
    value: "csv",
    label: "Importar CSV",
    description: "Arquivo separado por vírgulas",
    type: "CSV",
    icon: <FileText size={20} aria-hidden="true" />,
  },
  {
    value: "xlsx",
    label: "Importar XLSX",
    description: "Planilha do Excel",
    type: "Excel",
    icon: <Table2 size={20} aria-hidden="true" />,
  },
];

const previewColumns = [
  { name: "data_venda", type: "Data" },
  { name: "regiao", type: "Texto" },
  { name: "receita_liquida", type: "Moeda" },
];

const previewRows = [
  ["2026-09-01", "Sudeste", "R$ 412.300"],
  ["2026-09-01", "Sul", "R$ 228.900"],
  ["2026-09-02", "Nordeste", "R$ 154.100"],
];

const stepBase = "flex size-6 items-center justify-center rounded-full text-[11px] font-semibold";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

type AddSourceDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (source: DataSource, details: SourceDetails) => void;
};

/**
 * Fluxo guiado em 3 passos (tipo → configuração → prévia) simulando a
 * conexão de um banco ou a importação de um arquivo CSV/XLSX.
 */
export function AddSourceDialog({
  open,
  onClose,
  onCreated,
}: AddSourceDialogProps) {
  const [step, setStep] = useState(1);
  const [kind, setKind] = useState<Kind>("banco");
  const [name, setName] = useState("");
  const [host, setHost] = useState("db.exemplo.com");
  const [database, setDatabase] = useState("analytics");
  const [fileName, setFileName] = useState("");
  const [creating, setCreating] = useState(false);

  const selectedKind = kindOptions.find((option) => option.value === kind)!;
  const effectiveName =
    name.trim() ||
    (kind === "banco" ? `Nova conexão ${database}` : fileName.replace(/\.(csv|xlsx)$/i, ""));

  function reset() {
    setStep(1);
    setKind("banco");
    setName("");
    setFileName("");
    setHost("db.exemplo.com");
    setDatabase("analytics");
    setCreating(false);
  }

  function handleClose() {
    if (creating) return;
    reset();
    onClose();
  }

  function handleCreate() {
    setCreating(true);
    // Importação simulada (tempo fixo apenas em handler).
    setTimeout(() => {
      const idBase = slugify(effectiveName) || "nova-fonte";
      const id = `${idBase}-${Math.floor(Math.random() * 900 + 100)}`;
      const updatedDate = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const source: DataSource = {
        id,
        name: effectiveName,
        fileLabel:
          kind === "banco"
            ? `${host}/${database} · Sem projeto`
            : `${fileName || "arquivo." + (kind === "csv" ? "csv" : "xlsx")} · Sem projeto`,
        type: selectedKind.type,
        status: kind === "banco" ? "Conectada" : "Disponível",
        updatedDate,
        updatedMeta: "agora · Manual",
        rowIcon: kind === "banco" ? "database" : "file",
      };
      const details: SourceDetails = {
        id,
        subtitle:
          kind === "banco"
            ? `${selectedKind.type} · Conexão segura`
            : `${selectedKind.type} · Disponível`,
        badgeLabel: kind === "banco" ? "Conectada" : "Disponível",
        boxIcon: kind === "banco" ? "icon-database-lg" : "icon-file-text",
        properties: [
          { label: "Registros", value: "1.248" },
          { label: "Última sincronização", value: `${updatedDate}, agora` },
          ...(kind === "banco"
            ? [{ label: "Tabela de origem", value: `public.vendas` }]
            : []),
        ],
        columns: previewColumns,
        totalColumns: previewColumns.length,
      };
      onCreated(source, details);
      reset();
      onClose();
    }, 1000);
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Adicionar fonte de dados</DialogTitle>
      <DialogContent className="flex flex-col gap-5">
        {/* Indicador de passos */}
        <ol className="flex items-center gap-2" aria-label="Etapas">
          {["Tipo", "Configuração", "Prévia"].map((label, index) => {
            const number = index + 1;
            const active = step === number;
            const done = step > number;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`${stepBase} ${
                    active
                      ? "bg-brand text-white"
                      : done
                        ? "bg-success-bg text-success"
                        : "bg-background text-muted"
                  }`}
                  aria-hidden="true"
                >
                  {done ? "✓" : number}
                </span>
                <span
                  className={`text-xs leading-[1.5] ${active ? "font-semibold text-ink" : "text-muted"}`}
                >
                  {label}
                </span>
                {number < 3 && <span aria-hidden className="mx-1 h-px w-6 bg-line" />}
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Tipo de fonte">
            {kindOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={kind === option.value}
                onClick={() => setKind(option.value)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  kind === option.value
                    ? "border-brand bg-selection"
                    : "border-border-default hover:border-brand/40"
                }`}
              >
                <span className="text-brand">{option.icon}</span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-semibold leading-[1.5] text-ink">
                    {option.label}
                  </span>
                  <span className="text-xs leading-[1.5] text-muted">
                    {option.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            {kind === "banco" ? (
              <>
                <TextField
                  label="Servidor"
                  value={host}
                  onChange={(event) => setHost(event.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Banco de dados"
                  value={database}
                  onChange={(event) => setDatabase(event.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Usuário"
                  defaultValue="analista_bi"
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Senha"
                  type="password"
                  defaultValue="••••••••"
                  size="small"
                  fullWidth
                />
              </>
            ) : (
              <>
                <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border-default px-6 py-8">
                  <FileText size={24} aria-hidden="true" className="text-muted" />
                  <p className="text-sm leading-[1.5] text-ink">
                    {fileName || "Nenhum arquivo selecionado"}
                  </p>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() =>
                      setFileName(
                        kind === "csv" ? "vendas_setembro.csv" : "metas_2026.xlsx",
                      )
                    }
                  >
                    Selecionar arquivo (simulado)
                  </Button>
                  <p className="text-[11px] leading-[1.5] text-muted">
                    Máximo simulado de 50 MB · nenhuma cópia é enviada
                  </p>
                </div>
                <TextField
                  label="Nome da fonte"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  size="small"
                  fullWidth
                  helperText="Deixe em branco para usar o nome do arquivo."
                />
              </>
            )}
            {kind === "banco" && (
              <TextField
                label="Nome da fonte"
                value={name}
                onChange={(event) => setName(event.target.value)}
                size="small"
                fullWidth
                helperText="Deixe em branco para usar “Nova conexão [banco]”."
              />
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-subtle-bg p-3">
              {kind === "banco" ? (
                <Database size={20} aria-hidden="true" className="text-brand" />
              ) : (
                <FileText size={20} aria-hidden="true" className="text-brand" />
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-sm font-semibold leading-[1.5] text-ink">
                  {effectiveName}
                </p>
                <p className="text-xs leading-[1.5] text-muted">
                  {selectedKind.type}
                  {kind === "banco" ? ` · ${host}/${database}` : ` · ${fileName}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold leading-[1.5] text-ink">
                Prévia dos dados (simulada)
              </p>
              <div className="overflow-x-auto rounded-xl border border-border-default">
                <table className="w-full min-w-[380px] border-collapse text-left">
                  <thead>
                    <tr className="bg-subtle-bg">
                      {previewColumns.map((column) => (
                        <th
                          key={column.name}
                          className="px-3 py-2 text-[11px] font-semibold leading-[1.5] text-muted"
                        >
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, index) => (
                      <tr key={index} className="border-t border-line">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-3 py-2 font-mono text-[11px] leading-[1.5] text-ink"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Alert severity="success" icon={<CircleCheck size={18} />}>
              Conexão validada (simulação). A fonte ficará disponível na lista
              após a criação.
            </Alert>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose} disabled={creating}>
          Cancelar
        </Button>
        {step > 1 && (
          <Button
            color="inherit"
            onClick={() => setStep((current) => current - 1)}
            disabled={creating}
          >
            Voltar
          </Button>
        )}
        {step < 3 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setStep((current) => current + 1)}
          >
            Avançar
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? "Criando…" : "Criar fonte"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
