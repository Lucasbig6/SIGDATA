export type AnalysisType = "tabela" | "grafico";

export interface Analysis {
  id: string;
  projectId: string;
  title: string;
  type: AnalysisType;
  dataset: string;
  dimensionId: string;
  metricId: string;
  updatedAt: string;
  /** Publicada = versão salva; rascunho nunca sobrescreve sozinho. */
  published: boolean;
}

export const seedAnalyses: Analysis[] = [
  {
    id: "an-receita-regiao",
    projectId: "projeto-01",
    title: "Receita por região — setembro",
    type: "grafico",
    dataset: "Vendas 2026",
    dimensionId: "regiao",
    metricId: "receita",
    updatedAt: "14 de jul. de 2026",
    published: true,
  },
  {
    id: "an-metas-regional",
    projectId: "projeto-01",
    title: "Metas x realizado por regional",
    type: "tabela",
    dataset: "Metas comerciais",
    dimensionId: "regiao",
    metricId: "receita",
    updatedAt: "10 de jul. de 2026",
    published: true,
  },
  {
    id: "an-segmentos",
    projectId: "projeto-01",
    title: "Top segmentos de clientes",
    type: "grafico",
    dataset: "Clientes",
    dimensionId: "segmento",
    metricId: "receita",
    updatedAt: "8 de out. de 2026",
    published: false,
  },
  {
    id: "an-custos-margem",
    projectId: "dashboard-financeiro",
    title: "Receita por competência",
    type: "grafico",
    dataset: "Vendas 2026",
    dimensionId: "mes",
    metricId: "receita",
    updatedAt: "20 de mar. de 2026",
    published: true,
  },
];
