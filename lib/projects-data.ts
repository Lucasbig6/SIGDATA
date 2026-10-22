/**
 * Projetos mockados — fonte única da home, de /projetos e do workspace.
 *
 * Protótipo sem backend: ids fixos geram as rotas estáticas de
 * `/projetos/[id]`; projetos criados na sessão são somados pelo
 * `lib/projects-store.ts` (estado em memória).
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  meta: string;
  updatedDate: string;
  updatedMeta: string;
  sources: number;
  href: string;
}

export const projects: Project[] = [
  {
    id: "projeto-01",
    title: "Projeto 01 — Análise comercial",
    description: "Explore vendas, clientes e metas com IA.",
    meta: "14 de jul. de 2026 · 11 fontes",
    updatedDate: "14 de jul. de 2026",
    updatedMeta: "há 3 meses",
    sources: 11,
    href: "/projetos/projeto-01",
  },
  {
    id: "metas-indicadores-2026",
    title: "Metas e Indicadores 2026",
    description: "Acompanhamento de KPIs e metas anuais.",
    meta: "16 de dez. de 2025 · 40 fontes",
    updatedDate: "16 de dez. de 2025",
    updatedMeta: "há 10 meses",
    sources: 40,
    href: "/projetos/metas-indicadores-2026",
  },
  {
    id: "vendas-por-regional",
    title: "Vendas por Regional",
    description: "Desempenho de vendas segmentado por região.",
    meta: "5 de mar. de 2026 · 50 fontes",
    updatedDate: "5 de mar. de 2026",
    updatedMeta: "há 7 meses",
    sources: 50,
    href: "/projetos/vendas-por-regional",
  },
  {
    id: "clientes-recorrencia",
    title: "Clientes e Recorrência",
    description: "Análise de retenção e Lifetime Value.",
    meta: "30 de set. de 2025 · 38 fontes",
    updatedDate: "30 set. de 2025",
    updatedMeta: "há 12 meses",
    sources: 38,
    href: "/projetos/clientes-recorrencia",
  },
  {
    id: "estoque-suprimentos",
    title: "Estoque e Suprimentos",
    description: "Níveis de estoque, giro e rupturas.",
    meta: "30 de jan. de 2026 · 13 fontes",
    updatedDate: "30 de jan. de 2026",
    updatedMeta: "há 8 meses",
    sources: 13,
    href: "/projetos/estoque-suprimentos",
  },
  {
    id: "dashboard-financeiro",
    title: "Dashboard Financeiro",
    description: "Receita, custos e margem por período.",
    meta: "20 de mar. de 2026 · 35 fontes",
    updatedDate: "20 de mar. de 2026",
    updatedMeta: "há 7 meses",
    sources: 35,
    href: "/projetos/dashboard-financeiro",
  },
  {
    id: "rh-e-pessoas",
    title: "RH e Pessoas",
    description: "Headcount, turnover e absenteísmo.",
    meta: "10 de fev. de 2026 · 8 fontes",
    updatedDate: "10 de fev. de 2026",
    updatedMeta: "há 8 meses",
    sources: 8,
    href: "/projetos/rh-e-pessoas",
  },
  {
    id: "marketing-aquisicao",
    title: "Marketing e Aquisição",
    description: "Campanhas, canais e custo de aquisição.",
    meta: "22 de abr. de 2026 · 22 fontes",
    updatedDate: "22 de abr. de 2026",
    updatedMeta: "há 6 meses",
    sources: 22,
    href: "/projetos/marketing-aquisicao",
  },
];

export function projectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}
