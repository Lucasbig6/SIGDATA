/**
 * Assistente simulado: respostas por regras de palavra-chave (sem IA real).
 * Os números são fictícios porém coerentes com as demais telas do protótipo.
 */
export interface AnswerContent {
  /** Parágrafos — use **texto** para negrito. */
  intro: string[];
  bullets: string[];
  tip?: string;
  sources: string[];
  chartTitle?: string;
  chart?: { label: string; value: number }[];
  /** Se presente, a resposta oferece criar uma análise em rascunho. */
  analysisTitle?: string;
}

const revenueAnswer: AnswerContent = {
  intro: [
    "Em setembro, a receita líquida chegou a **R$ 2,48 milhões**, um crescimento de **12,4%** sobre agosto (R$ 2,21 milhões). O avanço foi de R$ 273,6 mil. [1]",
  ],
  bullets: [
    "Sudeste liderou o avanço. R$ 180 mil adicionais, equivalentes a 65,8% do crescimento total. [1]",
    "Sul foi o segundo destaque. Contribuição de R$ 62 mil; Nordeste e Centro-Oeste somaram R$ 31,6 mil. [1]",
    "Meta mensal superada. A receita ficou 5,5% acima da meta de R$ 2,35 milhões. [1, 2]",
  ],
  tip: "Próximo passo: detalhar os segmentos de clientes do Sudeste para identificar o que impulsionou a receita.",
  sources: ["1 · Vendas 2026", "2 · Metas comerciais"],
};

const regionAnswer: AnswerContent = {
  intro: [
    "Em setembro, o **Sudeste** concentrou R$ 1,12 milhão (45,2% da receita), seguido por **Sul** R$ 620 mil (25,0%), **Nordeste** R$ 420 mil (16,9%) e **Centro-Oeste** R$ 320 mil (12,9%). [1]",
  ],
  bullets: [
    "Sudeste e Sul somam 70,2% da receita do período.",
    "Nordeste cresceu 9,1% no trimestre, o maior avanço proporcional.",
    "Centro-Oeste é a menor participação, com 320 mil em setembro. [1]",
  ],
  tip: "Sugestão: criar um gráfico de receita por região para acompanhar a evolução mensal.",
  sources: ["1 · Vendas 2026"],
  chartTitle: "Receita por região — setembro",
  chart: [
    { label: "Sudeste", value: 1_120_000 },
    { label: "Sul", value: 620_000 },
    { label: "Nordeste", value: 420_000 },
    { label: "Centro-Oeste", value: 320_000 },
  ],
  analysisTitle: "Receita por região (gerado pelo assistente)",
};

const goalAnswer: AnswerContent = {
  intro: [
    "A meta de setembro era de **R$ 2,35 milhões** e a receita realizada foi de R$ 2,48 milhões: **105,5% da meta**. [2]",
  ],
  bullets: [
    "Sul atingiu 104% da meta e Sudeste 103%.",
    "Nordeste ficou em 97% e Centro-Oeste em 92% — abaixo do esperado. [2]",
    "O gap combinado das duas regionais abaixo da meta é de R$ 96 mil.",
  ],
  tip: "Foco recomendado: revisar o plano de ação do Centro-Oeste, há 3 meses consecutivos abaixo da meta.",
  sources: ["1 · Vendas 2026", "2 · Metas comerciais"],
  chartTitle: "Meta x realizado por regional",
  chart: [
    { label: "Sul", value: 104 },
    { label: "Sudeste", value: 103 },
    { label: "Nordeste", value: 97 },
    { label: "Centro-Oeste", value: 92 },
  ],
  analysisTitle: "Meta x realizado por regional (gerado pelo assistente)",
};

const segmentAnswer: AnswerContent = {
  intro: [
    "O segmento **Varejo** responde por R$ 1,48 milhão (59,7% da receita), com ticket médio de R$ 389. [1, 3]",
  ],
  bullets: [
    "Atacado: R$ 860 mil, com maior volume e menor margem.",
    "Institucional: R$ 140 mil, em queda de 8% sobre agosto. [1]",
    "A base tem 3.280 clientes ativos; 41% compraram mais de uma vez no trimestre. [3]",
  ],
  tip: "Sugestão: cruzar Varejo x Sudeste para identificar os produtos que puxaram o crescimento.",
  sources: ["1 · Vendas 2026", "3 · Clientes"],
};

const monthlyAnswer: AnswerContent = {
  intro: [
    "A evolução mensal da receita foi: **jul. R$ 2,11 mi → ago. R$ 2,21 mi (+4,9%) → set. R$ 2,48 mi (+12,4%)**. [1]",
  ],
  bullets: [
    "A aceleração em setembro é consistente com a sazonalidade do 2º semestre.",
    "Julho teve a menor receita do trimestre, alinhado ao recesso.",
    "Projeção simples para outubro, mantendo o ritmo: R$ 2,63 mi.",
  ],
  tip: "Atenção: projeção ingênua, sem sazonalidade formal — use apenas como referência.",
  sources: ["1 · Vendas 2026"],
};

const productAnswer: AnswerContent = {
  intro: [
    "As fontes selecionadas (Vendas 2026, Metas comerciais e Clientes) **não contêm o catálogo de produtos**.",
  ],
  bullets: [
    "A fonte “Produtos” já está disponível na aba Fontes.",
    "Depois de conectá-la, posso cruzar receita por SKU e categoria.",
  ],
  tip: "Vá até a aba **Fontes**, selecione “Produtos” e volte para continuar a análise.",
  sources: [],
};

const fallbackAnswer: AnswerContent = {
  intro: [
    "Ainda não tenho uma resposta simulada para essa pergunta. Posso ajudar com **receita, regiões, metas, segmentos, evolução mensal** ou criar gráficos a partir desses temas.",
  ],
  bullets: [
    "Exemplos: “Quais regiões não atingiram a meta?”, “Como evoluiu a receita?”, “Me mostre um gráfico por segmento”.",
  ],
  tip: "Este é um protótipo: respostas simuladas, sem conexão com modelos de IA reais.",
  sources: [],
};

const rules: { pattern: RegExp; answer: AnswerContent }[] = [
  { pattern: /regi|estad|uf\b|sudeste|nordeste|centro-oeste|\bsul\b/i, answer: regionAnswer },
  { pattern: /meta|ating|objetivo|goal/i, answer: goalAnswer },
  { pattern: /segmento|cliente|recorr|ltv|ticket/i, answer: segmentAnswer },
  { pattern: /m[eê]s|mensal|sazonal|evolu|julho|agosto|setembro|proje/i, answer: monthlyAnswer },
  { pattern: /produto|sku|categoria|estoque/i, answer: productAnswer },
];

/** Escolhe a resposta simulada a partir da pergunta do usuário. */
export function matchAnswer(question: string): AnswerContent {
  const normalized = question.trim().toLowerCase();
  if (normalized.length === 0) return fallbackAnswer;

  const wantsChart = /gr[aá]fico|visualiz|chart|plotar|montar/.test(normalized);
  for (const rule of rules) {
    if (rule.pattern.test(normalized)) {
      if (wantsChart && rule.answer.chart) return rule.answer;
      if (wantsChart && !rule.answer.chart) return revenueAnswer;
      return rule.answer;
    }
  }

  if (wantsChart) return regionAnswer;
  if (/receita|cresc|lucro|financeiro|resultado/.test(normalized)) return revenueAnswer;
  return fallbackAnswer;
}

export const assistantDefaultAnswer = revenueAnswer;

/** Renderiza parágrafos com **negrito** simples. */
export function renderRichText(text: string): React.ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-bold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
