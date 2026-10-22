/**
 * Dimensões, métricas e linhas mockadas usadas pela tela "Explorar dados"
 * e pelo editor de análises (valores simulados, coerentes com a home).
 */
export interface ExploreRow {
  category: string;
  value: number;
}

export interface Dimension {
  id: string;
  label: string;
  /** Coluna simulada no banco. */
  column: string;
  rows: ExploreRow[];
}

export const dimensions: Dimension[] = [
  {
    id: "regiao",
    label: "Região",
    column: "regiao",
    rows: [
      { category: "Sudeste", value: 1_120_000 },
      { category: "Sul", value: 620_000 },
      { category: "Nordeste", value: 420_000 },
      { category: "Centro-Oeste", value: 320_000 },
    ],
  },
  {
    id: "segmento",
    label: "Segmento",
    column: "segmento",
    rows: [
      { category: "Varejo", value: 1_480_000 },
      { category: "Atacado", value: 860_000 },
      { category: "Institucional", value: 140_000 },
    ],
  },
  {
    id: "mes",
    label: "Mês",
    column: "competencia",
    rows: [
      { category: "Jul", value: 2_106_000 },
      { category: "Ago", value: 2_210_000 },
      { category: "Set", value: 2_480_000 },
    ],
  },
  {
    // Dimensão indisponível de propósito: demonstra o estado de erro.
    id: "canal",
    label: "Canal de venda",
    column: "canal_id",
    rows: [],
  },
];

export type MetricFormat = "moeda" | "inteiro" | "percentual";

export interface Metric {
  id: string;
  label: string;
  column: string;
  format: MetricFormat;
}

export const metrics: Metric[] = [
  { id: "receita", label: "Receita líquida", column: "receita_liquida", format: "moeda" },
  { id: "pedidos", label: "Pedidos", column: "qtd_pedidos", format: "inteiro" },
  { id: "participacao", label: "Participação no total", column: "", format: "percentual" },
];

export function dimensionById(id: string): Dimension | undefined {
  return dimensions.find((dimension) => dimension.id === id);
}

export function metricById(id: string): Metric | undefined {
  return metrics.find((metric) => metric.id === id);
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const integer = new Intl.NumberFormat("pt-BR");

/** Aplica a métrica escolhida sobre as linhas brutas da dimensão. */
export function applyMetric(rows: ExploreRow[], metricId: string): ExploreRow[] {
  if (metricId === "pedidos") {
    return rows.map((row) => ({
      category: row.category,
      value: Math.round(row.value * 0.0021),
    }));
  }
  if (metricId === "participacao") {
    const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
    return rows.map((row) => ({
      category: row.category,
      value: Number(((row.value / total) * 100).toFixed(1)),
    }));
  }
  return rows;
}

export function formatMetricValue(value: number, metricId: string): string {
  const metric = metricById(metricId);
  if (metric?.format === "inteiro") return integer.format(value);
  if (metric?.format === "percentual") return `${value}%`;
  return brl.format(value);
}

/** Consulta simulada gerada pela escolha do usuário (referência visual). */
export function buildQuery(dimension: Dimension, metric: Metric): string {
  const aggregate =
    metric.id === "participacao"
      ? "ROUND(SUM(receita_liquida) * 100.0 / SUM(SUM(receita_liquida)) OVER (), 1)"
      : metric.id === "pedidos"
        ? "SUM(qtd_pedidos)"
        : "SUM(receita_liquida)";
  return `SELECT ${dimension.column}, ${aggregate} AS valor\nFROM vendas_2026\nGROUP BY ${dimension.column}\nORDER BY valor DESC;`;
}
