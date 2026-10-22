"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import {
  Bell,
  CircleCheck,
  Download,
  Mail,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { Button as UiButton } from "@/components/ui/button";

type SettingsTab = "perfil" | "preferencias" | "equipe" | "auditoria";

const tabs: { value: SettingsTab; label: string }[] = [
  { value: "perfil", label: "Perfil" },
  { value: "preferencias", label: "Preferências" },
  { value: "equipe", label: "Equipe" },
  { value: "auditoria", label: "Auditoria" },
];

type Role = "Administrador" | "Editor" | "Leitor";

type Member = { id: string; name: string; email: string; role: Role };

const seedMembers: Member[] = [
  { id: "m1", name: "Lucas Araújo", email: "lucas.araujo@saude.gov.br", role: "Administrador" },
  { id: "m2", name: "Marina Costa", email: "marina.costa@saude.gov.br", role: "Editor" },
  { id: "m3", name: "Rafael Nunes", email: "rafael.nunes@saude.gov.br", role: "Editor" },
  { id: "m4", name: "Camila Dias", email: "camila.dias@saude.gov.br", role: "Leitor" },
];

const auditRows = [
  { when: "14 de out. de 2026 · 09:12", who: "Marina Costa", action: "Publicou painel", target: "Painel Comercial" },
  { when: "13 de out. de 2026 · 17:40", who: "Rafael Nunes", action: "Importou fonte", target: "clientes.csv" },
  { when: "12 de out. de 2026 · 11:05", who: "Lucas Araújo", action: "Alterou permissão", target: "Camila Dias → Leitor" },
  { when: "10 de out. de 2026 · 08:33", who: "Sistema", action: "Sincronização automática", target: "Vendas 2026" },
  { when: "8 de out. de 2026 · 15:20", who: "Marina Costa", action: "Criou análise", target: "Top segmentos de clientes" },
  { when: "6 de out. de 2026 · 10:02", who: "Camila Dias", action: "Visualizou painel", target: "Painel de Estoque" },
];

const roleStyles: Record<Role, { bg: string; fg: string }> = {
  Administrador: { bg: "var(--color-selection)", fg: "var(--color-brand)" },
  Editor: { bg: "var(--color-info-bg, var(--color-subtle-bg))", fg: "var(--color-ink)" },
  Leitor: { bg: "var(--color-background)", fg: "var(--color-muted)" },
};

export function SettingsView() {
  const [tab, setTab] = useState<SettingsTab>("perfil");
  const [message, setMessage] = useState<string | null>(null);

  // Perfil
  const [name, setName] = useState("Lucas Araújo");
  const [email, setEmail] = useState("lucas.araujo@saude.gov.br");

  // Preferências
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [language, setLanguage] = useState("pt-BR");

  // Equipe
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Editor");

  function handleInvite() {
    const email = inviteEmail.trim();
    if (!email.includes("@")) return;
    const baseName = email.split("@")[0].replace(/[._]/g, " ");
    setMembers((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: baseName.charAt(0).toUpperCase() + baseName.slice(1),
        email,
        role: inviteRole,
      },
    ]);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("Editor");
    setMessage(`Convite enviado para ${email} (simulação).`);
  }

  return (
    <Card className="flex w-full flex-col overflow-hidden">
      <div className="border-b border-line px-5 pt-5">
        <Tabs
          value={tab}
          onChange={(_event, next: SettingsTab) => setTab(next)}
          aria-label="Seções das configurações"
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              minHeight: 44,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
            },
          }}
        >
          {tabs.map((item) => (
            <Tab key={item.value} value={item.value} label={item.label} />
          ))}
        </Tabs>
      </div>

      <div className="flex w-full flex-col gap-5 p-5">
        {message && (
          <p
            role="status"
            className="flex items-center gap-1.5 text-xs leading-[1.5] text-success"
          >
            <CircleCheck size={15} aria-hidden="true" />
            {message}
          </p>
        )}

        {tab === "perfil" && (
          <div className="flex w-full max-w-[520px] flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent text-xl font-bold text-white">
                LA
              </span>
              <div className="flex flex-col">
                <p className="text-base font-semibold leading-[1.5] text-ink">
                  {name}
                </p>
                <p className="text-xs leading-[1.5] text-muted">{email}</p>
              </div>
            </div>
            <TextField
              label="Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="E-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              size="small"
              fullWidth
            />
            <div className="flex items-center gap-2">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setMessage("Perfil atualizado (simulação).")}
              >
                Salvar perfil
              </Button>
              <Button color="inherit" onClick={() => setMessage(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {tab === "preferencias" && (
          <div className="flex w-full max-w-[560px] flex-col gap-4">
            {[
              {
                label: "Notificações por e-mail",
                description: "Resumos semanais dos projetos que você segue.",
                checked: notifyEmail,
                onChange: setNotifyEmail,
                icon: <Mail size={16} aria-hidden="true" />,
              },
              {
                label: "Sincronização automática",
                description: "Atualiza fontes conectadas todos os dias às 08:30.",
                checked: autoSync,
                onChange: setAutoSync,
                icon: <Bell size={16} aria-hidden="true" />,
              },
              {
                label: "Modo compacto",
                description: "Reduz o espaçamento entre cards e tabelas.",
                checked: compactMode,
                onChange: setCompactMode,
                icon: <ShieldCheck size={16} aria-hidden="true" />,
              },
            ].map((pref) => (
              <div
                key={pref.label}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-border-default p-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 text-brand">{pref.icon}</span>
                  <div className="flex min-w-0 flex-col">
                    <p className="text-sm font-semibold leading-[1.5] text-ink">
                      {pref.label}
                    </p>
                    <p className="text-xs leading-[1.5] text-muted">
                      {pref.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={pref.checked}
                  onChange={(event) => pref.onChange(event.target.checked)}
                  slotProps={{ input: { "aria-label": pref.label } }}
                />
              </div>
            ))}
            <TextField
              select
              label="Idioma da interface"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              size="small"
              sx={{ maxWidth: 280 }}
            >
              <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
              <MenuItem value="en-US">English (simulado)</MenuItem>
            </TextField>
            <Button
              variant="contained"
              color="primary"
              className="self-start"
              onClick={() => setMessage("Preferências salvas (simulação).")}
            >
              Salvar preferências
            </Button>
          </div>
        )}

        {tab === "equipe" && (
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users size={18} aria-hidden="true" className="text-brand" />
                <p className="text-sm font-semibold leading-[1.5] text-ink">
                  Membros do espaço de trabalho
                </p>
                <span className="rounded-md bg-background px-[9px] py-1 text-xs font-medium leading-[1.5] text-muted">
                  {members.length}
                </span>
              </div>
              <UiButton
                variant="primary"
                size="md"
                startIcon={<Plus size={16} />}
                onClick={() => setInviteOpen(true)}
              >
                Convidar membro
              </UiButton>
            </div>

            <ul className="flex w-full flex-col divide-y divide-line rounded-xl border border-border-default">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="flex w-full flex-col gap-3 p-4 sm:flex-row sm:items-center"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-selection text-xs font-bold text-brand">
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm font-semibold leading-[1.5] text-ink">
                      {member.name}
                    </p>
                    <p className="truncate text-xs leading-[1.5] text-muted">
                      {member.email}
                    </p>
                  </div>
                  <Chip
                    size="small"
                    label={member.role}
                    sx={{
                      borderRadius: "6px",
                      bgcolor: roleStyles[member.role].bg,
                      color: roleStyles[member.role].fg,
                    }}
                  />
                  <TextField
                    select
                    size="small"
                    value={member.role}
                    aria-label={`Perfil de ${member.name}`}
                    onChange={(event) =>
                      setMembers((prev) =>
                        prev.map((item) =>
                          item.id === member.id
                            ? { ...item, role: event.target.value as Role }
                            : item,
                        ),
                      )
                    }
                    sx={{ minWidth: 140 }}
                  >
                    {(["Administrador", "Editor", "Leitor"] as const).map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </TextField>
                  <UiButton
                    variant="subtle"
                    size="sm"
                    startIcon={<Trash2 size={14} />}
                    aria-label={`Remover ${member.name}`}
                    onClick={() => {
                      setMembers((prev) =>
                        prev.filter((item) => item.id !== member.id),
                      );
                      setMessage(`${member.name} removido (simulação).`);
                    }}
                  >
                    Remover
                  </UiButton>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "auditoria" && (
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} aria-hidden="true" className="text-brand" />
                <p className="text-sm font-semibold leading-[1.5] text-ink">
                  Registro de auditoria
                </p>
              </div>
              <UiButton
                variant="neutral"
                size="md"
                startIcon={<Download size={16} />}
                onClick={() =>
                  setMessage("Exportação simulada: auditoria.csv gerado.")
                }
              >
                Exportar log
              </UiButton>
            </div>

            <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-border-default">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="bg-subtle-bg">
                    <th className="px-4 py-2 text-[11px] font-semibold leading-[1.5] text-muted">
                      QUANDO
                    </th>
                    <th className="px-4 py-2 text-[11px] font-semibold leading-[1.5] text-muted">
                      QUEM
                    </th>
                    <th className="px-4 py-2 text-[11px] font-semibold leading-[1.5] text-muted">
                      AÇÃO
                    </th>
                    <th className="px-4 py-2 text-[11px] font-semibold leading-[1.5] text-muted">
                      RECURSO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auditRows.map((row, index) => (
                    <tr key={index} className="border-t border-line">
                      <td className="px-4 py-2 text-xs leading-[1.5] text-muted">
                        {row.when}
                      </td>
                      <td className="px-4 py-2 text-xs leading-[1.5] text-ink">
                        {row.who}
                      </td>
                      <td className="px-4 py-2 text-xs leading-[1.5] text-ink">
                        {row.action}
                      </td>
                      <td className="px-4 py-2 text-xs leading-[1.5] text-ink">
                        {row.target}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Convite de membro */}
      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Convidar membro</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4!">
          <TextField
            label="E-mail"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            size="small"
            fullWidth
            autoFocus
            type="email"
            helperText="Ex.: marina.costa@saude.gov.br"
          />
          <TextField
            select
            label="Perfil"
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value as Role)}
            size="small"
          >
            {(["Administrador", "Editor", "Leitor"] as const).map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <p className="text-xs leading-[1.5] text-muted">
            Simulação: nenhum e-mail é realmente enviado.
          </p>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setInviteOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!inviteEmail.includes("@")}
            onClick={handleInvite}
          >
            Enviar convite
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
