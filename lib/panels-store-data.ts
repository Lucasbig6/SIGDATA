export type WidgetKind = "kpi" | "grafico" | "tabela";

export interface PanelWidget {
  id: string;
  kind: WidgetKind;
  title: string;
  /** Análise opcional que alimenta o widget. */
  analysisId?: string;
}

export interface ProjectPanel {
  id: string;
  projectId: string;
  title: string;
  status: "rascunho" | "publicado";
  updatedAt: string;
  layout: "1" | "2";
  widgets: PanelWidget[];
}

export const seedPanels: ProjectPanel[] = [
  {
    id: "pp-comercial",
    projectId: "projeto-01",
    title: "Painel Comercial",
    status: "publicado",
    updatedAt: "12 de out. de 2026",
    layout: "2",
    widgets: [
      {
        id: "w-1",
        kind: "kpi",
        title: "Receita líquida — setembro",
        analysisId: "an-receita-regiao",
      },
      { id: "w-2", kind: "grafico", title: "Receita por região" },
      { id: "w-3", kind: "tabela", title: "Metas x realizado" },
    ],
  },
  {
    id: "pp-cobertura",
    projectId: "projeto-01",
    title: "Cobertura e metas",
    status: "rascunho",
    updatedAt: "6 de out. de 2026",
    layout: "1",
    widgets: [{ id: "w-4", kind: "tabela", title: "Metas por regional" }],
  },
  {
    id: "pp-financeiro",
    projectId: "dashboard-financeiro",
    title: "Painel Financeiro",
    status: "publicado",
    updatedAt: "10 de out. de 2026",
    layout: "2",
    widgets: [
      { id: "w-5", kind: "kpi", title: "Margem bruta" },
      { id: "w-6", kind: "grafico", title: "Receita por competência" },
    ],
  },
];
