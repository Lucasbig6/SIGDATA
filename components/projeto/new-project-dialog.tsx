"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Plus } from "lucide-react";
import { Button as UiButton } from "@/components/ui/button";
import { addProject } from "@/lib/projects-store";

type NewProjectButtonProps = {
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Abre o modal de criação e, ao confirmar, cria o projeto em memória
 * e navega para o workspace recém-criado.
 */
export function NewProjectButton({
  label = "Novo projeto",
  size = "md",
  className,
}: NewProjectButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setOpen(false);
    setTitle("");
    setDescription("");
    setError(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (trimmed.length < 3) {
      setError("Informe um nome com pelo menos 3 caracteres.");
      return;
    }
    const project = addProject({ title: trimmed, description });
    handleClose();
    router.push(`/projetos/${project.id}`);
  }

  return (
    <>
      <UiButton
        variant="primary"
        size={size}
        className={className}
        startIcon={<Plus size={16} />}
        onClick={() => setOpen(true)}
      >
        {label}
      </UiButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700 }}>Novo projeto</DialogTitle>
          <DialogContent className="flex flex-col gap-4 pt-4!">
            <TextField
              label="Nome do projeto"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(null);
              }}
              error={Boolean(error)}
              helperText={error ?? "Ex.: “Cobertura vacinal por região”"}
              size="small"
              autoFocus
              fullWidth
            />
            <TextField
              label="Descrição (opcional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={2}
              helperText="Para que serve este projeto?"
            />
            <p className="text-xs leading-[1.5] text-muted">
              Criação simulada: o projeto fica disponível durante esta sessão e
              não é salvo em servidor.
            </p>
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Criar projeto
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
