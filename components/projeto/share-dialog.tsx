"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Check, Copy } from "lucide-react";

type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  projectId: string;
};

/** Simula o compartilhamento: gera um link fictício e copia para a área de transferência. */
export function ShareDialog({
  open,
  onClose,
  title,
  projectId,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const link = `https://sigdata.demo/projetos/${projectId}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Área de transferência indisponível: o feedback visual ainda é exibido.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Compartilhar “{title}”
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <p className="text-sm leading-[1.5] text-muted">
          Simulação de compartilhamento: qualquer pessoa com o link abaixo teria
          acesso somente de leitura a este projeto.
        </p>
        <TextField
          label="Link do projeto"
          value={link}
          size="small"
          slotProps={{
            input: { readOnly: true },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Fechar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCopy}
          startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
        >
          {copied ? "Link copiado" : "Copiar link"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
