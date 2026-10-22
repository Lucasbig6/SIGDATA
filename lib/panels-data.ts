/**
 * Painéis compartilhados mockados (home e módulo de painéis do projeto).
 *
 * O acesso é contextual ao projeto (decisão da auditoria): cada painel
 * aponta para o workspace do projeto dono.
 */
export interface Panel {
  id: string;
  title: string;
  description: string;
  meta: string;
  projectId: string;
  href: string;
}

export const recentPanels: Panel[] = [
  {
    id: "painel-comercial",
    title: "Painel Comercial",
    description: "Vendas, metas e conversão por regional.",
    meta: "12 de out. de 2026 · 8 fontes",
    projectId: "projeto-01",
    href: "/projetos/projeto-01",
  },
  {
    id: "painel-financeiro",
    title: "Painel Financeiro",
    description: "Receita, custos e margem por período.",
    meta: "10 de out. de 2026 · 5 fontes",
    projectId: "dashboard-financeiro",
    href: "/projetos/dashboard-financeiro",
  },
  {
    id: "painel-estoque",
    title: "Painel de Estoque",
    description: "Níveis, giro e rupturas por depósito.",
    meta: "8 de out. de 2026 · 3 fontes",
    projectId: "estoque-suprimentos",
    href: "/projetos/estoque-suprimentos",
  },
];
