export interface ProjectSource {
  id: string;
  name: string;
  meta: string;
}

export const projectSources: ProjectSource[] = [
  {
    id: "vendas-2026",
    name: "Vendas 2026",
    meta: "PostgreSQL · 18.420 registros",
  },
  {
    id: "metas-comerciais",
    name: "Metas comerciais",
    meta: "XLSX · 36 registros",
  },
  { id: "clientes", name: "Clientes", meta: "CSV · 3.280 registros" },
  { id: "produtos", name: "Produtos", meta: "CSV · 428 registros" },
];

/** Seleção inicial do Figma: "3 de 4". */
export const initialSelectedSourceIds: string[] = [
  "vendas-2026",
  "metas-comerciais",
  "clientes",
];

export const suggestedQuestions: string[] = [
  "Comparar receita por segmento ↗",
  "Quais regiões não atingiram a meta? ↗",
];

export const previewColumns: { name: string; type: string }[] = [
  { name: "data_venda", type: "Data" },
  { name: "regiao", type: "Texto" },
  { name: "receita_liquida", type: "Moeda" },
  { name: "cliente_id", type: "Identificador" },
];

export const initialUserQuestion = {
  time: "09:41",
  text: "Como a receita de setembro evoluiu em relação a agosto e quais regiões explicam o crescimento?",
};

export const initialAssistantTime = "09:41";

export const regionRows: { region: string; value: string }[] = [
  { region: "Sudeste", value: "R$ 1.120.000" },
  { region: "Sul", value: "R$ 620.000" },
  { region: "Nordeste", value: "R$ 420.000" },
  { region: "Centro-Oeste", value: "R$ 320.000" },
];

export const assistantPlainText = [
  "Em setembro, a receita líquida chegou a R$ 2,48 milhões, um crescimento de 12,4% sobre agosto (R$ 2,21 milhões). O avanço foi de R$ 273,6 mil. [1]",
  "",
  "• Sudeste liderou o avanço. R$ 180 mil adicionais, equivalentes a 65,8% do crescimento total. [1]",
  "• Sul foi o segundo destaque. Contribuição de R$ 62 mil; Nordeste e Centro-Oeste somaram R$ 31,6 mil. [1]",
  "• Meta mensal superada. A receita ficou 5,5% acima da meta de R$ 2,35 milhões. [1, 2]",
  "",
  "Próximo passo: detalhar os segmentos de clientes do Sudeste para identificar o que impulsionou a receita.",
].join("\n");

/** Barras do mini-gráfico "Evolução da receita" (painel de Resultados). */
export const chartBars: { label: string; height: number; accent: boolean }[] = [
  { label: "Jul", height: 27, accent: false },
  { label: "Ago", height: 35, accent: false },
  { label: "Set", height: 54, accent: true },
];
