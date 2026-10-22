"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { CircleCheck, TriangleAlert } from "lucide-react";
import type { DataSource } from "@/lib/sources-data";

type EditConnectionDialogProps = {
  source: DataSource | null;
  onClose: () => void;
  onSaved: (name: string) => void;
};

/** Edita o nome/conexão de uma fonte (simulação — nada é persistido). */
export function EditConnectionDialog({
  source,
  onClose,
  onSaved,
}: EditConnectionDialogProps) {
  const [name, setName] = useState(source?.name ?? "");
  const [endpoint, setEndpoint] = useState(
    source?.type === "PostgreSQL" || source?.type === "API REST"
      ? "db.exemplo.com:5432/analytics"
      : "arquivos/entradas",
  );

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName(source?.name ?? "");
      onClose();
    }
  }

  return (
    <Dialog
      open={source !== null}
      onClose={handleOpenChange}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Editar conexão{source ? ` — ${source.name}` : ""}
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4 pt-4!">
        <TextField
          label="Nome da fonte"
          value={name}
          onChange={(event) => setName(event.target.value)}
          size="small"
          fullWidth
          autoFocus
        />
        <TextField
          label={source?.type === "CSV" || source?.type === "Excel" ? "Origem" : "Servidor / endpoint"}
          value={endpoint}
          onChange={(event) => setEndpoint(event.target.value)}
          size="small"
          fullWidth
        />
        <p className="text-xs leading-[1.5] text-muted">
          Simulação: as alterações valem apenas para esta sessão.
        </p>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={() => handleOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={name.trim().length === 0}
          onClick={() => {
            onSaved(name.trim());
            onClose();
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type ReviewConnectionDialogProps = {
  source: DataSource | null;
  onClose: () => void;
  onFixed: () => void;
};

/** Revisa uma conexão com problema e simula o teste de conexão. */
export function ReviewConnectionDialog({
  source,
  onClose,
  onFixed,
}: ReviewConnectionDialogProps) {
  const [testing, setTesting] = useState(false);
  const [fixed, setFixed] = useState(false);

  function handleClose() {
    if (testing) return;
    setTesting(false);
    setFixed(false);
    onClose();
  }

  function handleTest() {
    setTesting(true);
    setFixed(false);
    // Teste simulado (tempo fixo apenas em handler).
    setTimeout(() => {
      setTesting(false);
      setFixed(true);
      onFixed();
    }, 1200);
  }

  return (
    <Dialog open={source !== null} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Revisar conexão{source ? ` — ${source.name}` : ""}
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <Alert severity="warning" icon={<TriangleAlert size={18} />}>
          A última sincronização falhou (23:00 · falha na conexão). Confira o
          endpoint e as credenciais antes de tentar novamente.
        </Alert>
        <dl className="flex flex-col gap-2 rounded-xl bg-subtle-bg p-3 text-xs leading-[1.5]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Tipo</dt>
            <dd className="font-medium text-ink">{source?.type}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Endpoint</dt>
            <dd className="font-medium text-ink">
              {source?.type === "API REST" ? "api.exemplo.com/estoque" : "db.exemplo.com"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Estado</dt>
            <dd className="font-medium text-warning">{source?.status}</dd>
          </div>
        </dl>
        {testing && (
          <p
            role="status"
            className="flex items-center gap-2 text-xs leading-[1.5] text-brand"
          >
            <span className="size-3 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            Testando conexão…
          </p>
        )}
        {fixed && (
          <Alert severity="success" icon={<CircleCheck size={18} />}>
            Conexão restabelecida (simulação). A fonte voltou a ficar
            disponível.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose} disabled={testing}>
          Fechar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTest}
          disabled={testing || fixed}
        >
          Testar conexão
        </Button>
      </DialogActions>
    </Dialog>
  );
}
