export type SourceStatus =
  | "Conectada"
  | "Disponível"
  | "Processando"
  | "Requer atenção";

export type SourceType = "PostgreSQL" | "Excel" | "CSV" | "API REST";

export type RowIcon = "database" | "file" | "empty";

export interface DataSource {
  id: string;
  name: string;
  /** Subtítulo da linha: registros/conexão e projeto. */
  fileLabel: string;
  type: SourceType;
  status: SourceStatus;
  updatedDate: string;
  updatedMeta: string;
  rowIcon: RowIcon;
}

export interface SourceDetails {
  id: string;
  /** Subtítulo do painel de detalhes. */
  subtitle: string;
  /** Badge de estado do painel. */
  badgeLabel: string;
  boxIcon: string;
  properties: { label: string; value: string }[];
  usedIn?: { project: string; panel?: string };
  quality?: { title: string; text: string };
  columns?: { name: string; type: string }[];
  totalColumns?: number;
}

export const dataSources: DataSource[] = [
  {
    id: "vendas-2026",
    name: "Vendas 2026",
    fileLabel: "18.420 registros · Projeto 01",
    type: "PostgreSQL",
    status: "Conectada",
    updatedDate: "01 out. 2026",
    updatedMeta: "08:30 · Automática",
    rowIcon: "database",
  },
  {
    id: "metas-comerciais",
    name: "Metas comerciais",
    fileLabel: "metas_comerciais.xlsx · Projeto 01",
    type: "Excel",
    status: "Disponível",
    updatedDate: "01 out. 2026",
    updatedMeta: "08:15 · Manual",
    rowIcon: "empty",
  },
  {
    id: "clientes",
    name: "Clientes",
    fileLabel: "clientes.csv · Projeto 01",
    type: "CSV",
    status: "Disponível",
    updatedDate: "30 set. 2026",
    updatedMeta: "18:02 · Manual",
    rowIcon: "file",
  },
  {
    id: "produtos",
    name: "Produtos",
    fileLabel: "produtos.csv · Projeto 01",
    type: "CSV",
    status: "Disponível",
    updatedDate: "30 set. 2026",
    updatedMeta: "17:45 · Manual",
    rowIcon: "file",
  },
  {
    id: "custos-operacionais",
    name: "Custos operacionais",
    fileLabel: "custos_setembro.csv · Sem projeto",
    type: "CSV",
    status: "Processando",
    updatedDate: "01 out. 2026",
    updatedMeta: "09:38 · Importação",
    rowIcon: "file",
  },
  {
    id: "estoque",
    name: "Estoque",
    fileLabel: "api.exemplo.com/estoque · Operações",
    type: "API REST",
    status: "Requer atenção",
    updatedDate: "30 set. 2026",
    updatedMeta: "23:00 · Falha na conexão",
    rowIcon: "empty",
  },
];

/**
 * Detalhes por fonte. Somente dados presentes no Figma (tela de detalhe de
 * "Vendas 2026" e contagens exibidas na tela do Projeto 01); o restante é
 * derivado das próprias linhas do catálogo. Seções sem dado demonstrativo
 * ficam ausentes — nada é inventado.
 */
export const sourceDetails: Record<string, SourceDetails> = {
  "vendas-2026": {
    id: "vendas-2026",
    subtitle: "PostgreSQL · Conexão segura",
    badgeLabel: "Conectada e atualizada",
    boxIcon: "icon-database-lg",
    properties: [
      { label: "Tabela de origem", value: "public.vendas" },
      { label: "Registros", value: "18.420" },
      { label: "Colunas", value: "8 campos" },
      { label: "Tamanho", value: "12,6 MB" },
      { label: "Atualização", value: "Diária, às 08:30" },
      { label: "Última sincronização", value: "01 out. 2026, 08:30" },
    ],
    usedIn: { project: "Projeto 01", panel: "Desempenho comercial" },
    quality: {
      title: "Estrutura validada",
      text: "Sem campos obrigatórios ausentes na última sincronização.",
    },
    columns: [
      { name: "data_venda", type: "Data" },
      { name: "regiao", type: "Texto" },
      { name: "receita_liquida", type: "Moeda" },
      { name: "cliente_id", type: "Identificador" },
    ],
    totalColumns: 8,
  },
  "metas-comerciais": {
    id: "metas-comerciais",
    subtitle: "Excel · Disponível",
    badgeLabel: "Disponível",
    boxIcon: "icon-file-text",
    properties: [
      { label: "Registros", value: "36" },
      { label: "Última sincronização", value: "01 out. 2026, 08:15" },
    ],
    usedIn: { project: "Projeto 01" },
  },
  clientes: {
    id: "clientes",
    subtitle: "CSV · Disponível",
    badgeLabel: "Disponível",
    boxIcon: "icon-file-text",
    properties: [
      { label: "Registros", value: "3.280" },
      { label: "Última sincronização", value: "30 set. 2026, 18:02" },
    ],
    usedIn: { project: "Projeto 01" },
  },
  produtos: {
    id: "produtos",
    subtitle: "CSV · Disponível",
    badgeLabel: "Disponível",
    boxIcon: "icon-file-text",
    properties: [
      { label: "Registros", value: "428" },
      { label: "Última sincronização", value: "30 set. 2026, 17:45" },
    ],
    usedIn: { project: "Projeto 01" },
  },
  "custos-operacionais": {
    id: "custos-operacionais",
    subtitle: "CSV · Processando",
    badgeLabel: "Processando",
    boxIcon: "icon-file-text",
    properties: [
      { label: "Última sincronização", value: "01 out. 2026, 09:38" },
    ],
  },
  estoque: {
    id: "estoque",
    subtitle: "API REST · Requer atenção",
    badgeLabel: "Requer atenção",
    boxIcon: "icon-database-lg",
    properties: [
      { label: "Última sincronização", value: "30 set. 2026, 23:00" },
    ],
  },
};

export const statusStyles: Record<
  SourceStatus,
  { className: string; emptyIcon: boolean; bg: string; fg: string }
> = {
  Conectada: {
    className: "bg-success-bg text-success",
    emptyIcon: true,
    bg: "var(--color-success-bg)",
    fg: "var(--color-success)",
  },
  "Disponível": {
    className: "bg-success-bg text-success",
    emptyIcon: true,
    bg: "var(--color-success-bg)",
    fg: "var(--color-success)",
  },
  Processando: {
    className: "bg-selection text-brand",
    emptyIcon: true,
    bg: "var(--color-selection)",
    fg: "var(--color-brand)",
  },
  "Requer atenção": {
    className: "bg-warning-bg text-warning",
    emptyIcon: true,
    bg: "var(--color-warning-bg)",
    fg: "var(--color-warning)",
  },
};

export const typeOptions: Array<"Todos os tipos" | SourceType> = [
  "Todos os tipos",
  "PostgreSQL",
  "Excel",
  "CSV",
  "API REST",
];

export const statusOptions: Array<"Todos os estados" | SourceStatus> = [
  "Todos os estados",
  "Conectada",
  "Disponível",
  "Processando",
  "Requer atenção",
];

export interface SourceStat {
  title: string;
  value: string;
  context: string;
  /** Mostra o ícone de banco no card (só no primeiro). */
  icon: boolean;
}

/** Cards de resumo da tela /fontes-de-dados (coerentes com dataSources). */
export const sourceStats: SourceStat[] = [
  {
    title: "Total de fontes",
    value: String(dataSources.length),
    context: "Conexões e arquivos",
    icon: true,
  },
  {
    title: "Prontas para análise",
    value: String(
      dataSources.filter(
        (source) => source.status === "Conectada" || source.status === "Disponível",
      ).length,
    ),
    context: "Disponíveis para seus projetos",
    icon: false,
  },
  {
    title: "Em processamento",
    value: String(
      dataSources.filter((source) => source.status === "Processando").length,
    ),
    context: "Custos operacionais",
    icon: false,
  },
  {
    title: "Requer atenção",
    value: String(
      dataSources.filter((source) => source.status === "Requer atenção").length,
    ),
    context: "Revise a conexão de Estoque",
    icon: false,
  },
];
