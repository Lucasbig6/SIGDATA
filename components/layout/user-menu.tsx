"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { Info, LogOut, Settings } from "lucide-react";
import { Menu } from "@mui/material";
import IconButton from "@mui/material/IconButton";

/**
 * Menu do usuário (substitui o botão "Entrar" fachada): acessa
 * Configurações e demonstra "Sobre" e "Sair" (simulados).
 */
export function UserMenu() {
  const router = useRouter();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [dialog, setDialog] = useState<"sobre" | "sair" | null>(null);

  return (
    <>
      <IconButton
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label="Abrir menu do usuário"
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent text-sm font-bold text-white"
      >
        LA
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div className="px-4 py-2">
          <p className="text-sm font-semibold leading-[1.5] text-ink">
            Lucas Araújo
          </p>
          <p className="text-xs leading-[1.5] text-muted">
            lucas.araujo@saude.gov.br
          </p>
        </div>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            router.push("/configuracoes");
          }}
        >
          <Settings size={15} aria-hidden="true" className="mr-2" />
          Configurações
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            setDialog("sobre");
          }}
        >
          <Info size={15} aria-hidden="true" className="mr-2" />
          Sobre o protótipo
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            setDialog("sair");
          }}
        >
          <LogOut size={15} aria-hidden="true" className="mr-2" />
          Sair
        </MenuItem>
      </Menu>

      <Dialog
        open={dialog === "sobre"}
        onClose={() => setDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>SIGDATA — protótipo</DialogTitle>
        <DialogContent>
          <p className="text-sm leading-[1.6] text-muted">
            Protótipo visual e interativo de plataforma de BI para saúde
            pública. Todos os dados e ações são simulados no navegador, sem
            backend, autenticação ou integrações reais.
          </p>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => setDialog(null)}>
            Entendi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialog === "sair"}
        onClose={() => setDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Sessão encerrada</DialogTitle>
        <DialogContent>
          <p className="text-sm leading-[1.6] text-muted">
            Simulação de logout: nada foi realmente encerrado e os dados desta
            sessão continuam no navegador até atualizar a página.
          </p>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setDialog(null)}>
            Fechar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialog(null)}
          >
            Entrar novamente
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
