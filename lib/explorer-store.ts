import type { ThreadMessageLike } from "@assistant-ui/react";
import {
  assistantDefaultAnswer,
  matchAnswer,
  type AnswerContent,
} from "./assistant-rules";
import { dimensions } from "./explore-data";
import { initialUserQuestion, regionRows } from "./project-data";
import { createStore, useStore } from "./store";

/** Mensagens do workspace: payloads próprios, convertidos para o runtime. */
export type ChatMessage =
  | { id: string; role: "user"; time: string; text: string }
  | {
      id: string;
      role: "assistant";
      time: string;
      answer: AnswerContent;
      artifactId?: string;
    };

export interface Conversation {
  id: string;
  title: string;
  time: string;
  messages: ChatMessage[];
}

export type ArtifactKind = "grafico" | "tabela" | "resumo";

export interface Artifact {
  id: string;
  kind: ArtifactKind;
  title: string;
  meta: string;
  createdAt: string;
  /** `chat` = gerado pela conversa; `seed` = conteúdo inicial do protótipo. */
  origin: "chat" | "seed";
  chart?: { label: string; value: number }[];
  rows?: { label: string; value: string }[];
  summary?: { headline: string; text: string };
  dataset?: string;
  dimensionId?: string;
  metricId?: string;
  /** Título usado ao salvar como análise. */
  analysisTitle?: string;
}

interface ExplorerState {
  conversations: Conversation[];
  activeConversationId: string;
  artifacts: Artifact[];
  pendingIds: string[];
  focusedArtifactId: string | null;
  /** Área de trabalho visível (abre sozinha quando um artefato é gerado). */
  workspaceOpen: boolean;
}

const UNTITLED = "Nova conversa";

function answer(question: string): AnswerContent {
  return matchAnswer(question);
}

/** Conversas de exemplo: memória simulada do histórico lateral. */
const seedConversations: Conversation[] = [
  {
    id: "conv-receita",
    title: "Receita de setembro",
    time: "09:41",
    messages: [
      {
        id: "m-seed-1",
        role: "user",
        time: "09:41",
        text: initialUserQuestion.text,
      },
      {
        id: "m-seed-2",
        role: "assistant",
        time: "09:41",
        answer: assistantDefaultAnswer,
      },
    ],
  },
  {
    id: "conv-metas",
    title: "Metas por regional",
    time: "ontem",
    messages: [
      {
        id: "m-seed-3",
        role: "user",
        time: "16:08",
        text: "A meta de setembro foi atingida por todas as regionais?",
      },
      {
        id: "m-seed-4",
        role: "assistant",
        time: "16:08",
        answer: answer(
          "A meta de setembro foi atingida por todas as regionais?",
        ),
      },
    ],
  },
  {
    id: "conv-segmentos",
    title: "Segmentos de clientes",
    time: "12 out.",
    messages: [
      {
        id: "m-seed-5",
        role: "user",
        time: "11:24",
        text: "Como a receita se divide por segmento de cliente?",
      },
      {
        id: "m-seed-6",
        role: "assistant",
        time: "11:24",
        answer: answer("Como a receita se divide por segmento de cliente?"),
      },
    ],
  },
];

const monthDimension = dimensions.find((item) => item.id === "mes");

/** Resultados iniciais da área de trabalho (mesma base do painel antigo). */
const seedArtifacts: Artifact[] = [
  {
    id: "art-evolucao",
    kind: "grafico",
    title: "Evolução da receita",
    meta: "Vendas 2026 · receita líquida por mês",
    createdAt: "09:42",
    origin: "seed",
    chart: monthDimension
      ? monthDimension.rows.map((row) => ({
          label: row.category,
          value: row.value,
        }))
      : [
          { label: "Jul", value: 2_106_000 },
          { label: "Ago", value: 2_210_000 },
          { label: "Set", value: 2_480_000 },
        ],
    dataset: "Vendas 2026",
    dimensionId: "mes",
    metricId: "receita",
    analysisTitle: "Evolução da receita (gerado pelo assistente)",
  },
  {
    id: "art-regiao-tabela",
    kind: "tabela",
    title: "Receita por região",
    meta: "Vendas 2026 · 4 linhas",
    createdAt: "09:42",
    origin: "seed",
    rows: regionRows.map((row) => ({ label: row.region, value: row.value })),
    dataset: "Vendas 2026",
    dimensionId: "regiao",
    metricId: "receita",
    analysisTitle: "Receita por região (gerado pelo assistente)",
  },
  {
    id: "art-resumo",
    kind: "resumo",
    title: "Resumo executivo — setembro",
    meta: "2 fontes · salvo às 09:42",
    createdAt: "09:42",
    origin: "seed",
    summary: {
      headline: "Receita de R$ 2,48 mi, alta de 12,4%",
      text: "Sudeste responde por 65,8% do crescimento sobre agosto e a meta mensal foi superada em 5,5%.",
    },
    dataset: "Vendas 2026",
    dimensionId: "regiao",
    metricId: "receita",
    analysisTitle: "Resumo executivo de setembro (gerado pelo assistente)",
  },
];

const store = createStore<ExplorerState>({
  conversations: seedConversations,
  activeConversationId: seedConversations[0].id,
  artifacts: seedArtifacts,
  pendingIds: [],
  focusedArtifactId: null,
  workspaceOpen: true,
});

export function useExplorer(): ExplorerState {
  return useStore(store);
}

export function useActiveConversation(): Conversation {
  const state = useStore(store);
  return (
    state.conversations.find((item) => item.id === state.activeConversationId) ??
    state.conversations[0]
  );
}

let counter = 0;

/** Ids gerados apenas em handlers (nunca durante o render). */
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

function nowTime(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(text: string, max = 44): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export function createConversation(): string {
  const id = nextId("conv");
  const conversation: Conversation = {
    id,
    title: UNTITLED,
    time: nowTime(),
    messages: [],
  };
  store.set((prev) => ({
    ...prev,
    conversations: [conversation, ...prev.conversations],
    activeConversationId: id,
    focusedArtifactId: null,
  }));
  return id;
}

export function selectConversation(id: string): void {
  store.set((prev) =>
    prev.activeConversationId === id
      ? prev
      : { ...prev, activeConversationId: id, focusedArtifactId: null },
  );
}

export function startRun(conversationId: string): void {
  store.set((prev) =>
    prev.pendingIds.includes(conversationId)
      ? prev
      : { ...prev, pendingIds: [...prev.pendingIds, conversationId] },
  );
}

export function appendUserMessage(conversationId: string, text: string): void {
  const time = nowTime();
  const message: ChatMessage = {
    id: nextId("m"),
    role: "user",
    time,
    text,
  };
  store.set((prev) => ({
    ...prev,
    conversations: prev.conversations.map((conversation) => {
      if (conversation.id !== conversationId) return conversation;
      return {
        ...conversation,
        time,
        // O primeiro envio dá nome à conversa criada vazia.
        title:
          conversation.title === UNTITLED ? truncate(text) : conversation.title,
        messages: [...conversation.messages, message],
      };
    }),
  }));
}

/**
 * Conclui a resposta simulada em uma única atualização de estado:
 * mensagem do assistente + artefato novo + fim do "pensando".
 */
export function completeRun(
  conversationId: string,
  answerContent: AnswerContent,
  artifact: Artifact | null,
): void {
  const time = nowTime();
  store.set((prev) => {
    const artifacts = artifact ? [artifact, ...prev.artifacts] : prev.artifacts;
    const message: ChatMessage = {
      id: nextId("m"),
      role: "assistant",
      time,
      answer: answerContent,
      artifactId: artifact?.id,
    };
    return {
      ...prev,
      artifacts,
      focusedArtifactId: artifact ? artifact.id : prev.focusedArtifactId,
      // Um artefato novo traz a área de trabalho de volta, se recolhida.
      workspaceOpen: artifact ? true : prev.workspaceOpen,
      pendingIds: prev.pendingIds.filter((id) => id !== conversationId),
      conversations: prev.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              time,
              messages: [...conversation.messages, message],
            }
          : conversation,
      ),
    };
  });
}

export function focusArtifact(id: string | null): void {
  store.set((prev) => {
    if (prev.focusedArtifactId === id && (!id || prev.workspaceOpen)) return prev;
    return {
      ...prev,
      focusedArtifactId: id,
      workspaceOpen: id ? true : prev.workspaceOpen,
    };
  });
}

/** Recolhe/abre a área de trabalho (ação disparada por handlers). */
export function setWorkspaceOpen(open: boolean): void {
  store.set((prev) =>
    prev.workspaceOpen === open ? prev : { ...prev, workspaceOpen: open },
  );
}

export function addArtifact(artifact: Artifact): string {
  store.set((prev) => ({
    ...prev,
    artifacts: [artifact, ...prev.artifacts],
    focusedArtifactId: artifact.id,
    workspaceOpen: true,
  }));
  return artifact.id;
}

export function createArtifactId(): string {
  return nextId("art");
}

/** Dimensão do protótipo cujos rótulos casam com o gráfico da resposta. */
export function guessDimensionId(labels: string[]): string | undefined {
  return dimensions.find(
    (dimension) =>
      dimension.rows.length === labels.length &&
      dimension.rows.every((row, index) => row.category === labels[index]),
  )?.id;
}

/** Métrica provável: valores pequenos viram percentual, os demais moeda. */
export function guessMetricId(values: number[]): string {
  if (values.length === 0) return "receita";
  const small = values.every((value) => value <= 200);
  const belowHundred = values.some((value) => value < 100);
  return small && belowHundred ? "participacao" : "receita";
}

/** Monta o artefato da área de trabalho a partir de uma resposta com gráfico. */
export function artifactFromAnswer(
  answerContent: AnswerContent,
  sourceCount: number,
): Artifact | null {
  if (!answerContent.chart) return null;
  const labels = answerContent.chart.map((item) => item.label);
  const values = answerContent.chart.map((item) => item.value);
  return {
    id: createArtifactId(),
    kind: "grafico",
    title: answerContent.chartTitle ?? "Visualização gerada",
    meta: `${sourceCount} ${sourceCount === 1 ? "fonte" : "fontes"} · gerado agora`,
    createdAt: nowTime(),
    origin: "chat",
    chart: answerContent.chart,
    dataset: "Vendas 2026",
    dimensionId: guessDimensionId(labels) ?? "regiao",
    metricId: guessMetricId(values),
    analysisTitle: answerContent.analysisTitle,
  };
}

/** Texto puro da resposta (cópia e conteúdo do runtime). */
export function answerToPlainText(answerContent: AnswerContent): string {
  const lines = [
    ...answerContent.intro.map((item) => item.replace(/\*\*/g, "")),
    ...answerContent.bullets.map((item) => `• ${item}`.replace(/\*\*/g, "")),
  ];
  if (answerContent.tip) lines.push(answerContent.tip.replace(/\*\*/g, ""));
  if (answerContent.sources.length > 0) {
    lines.push(`Fontes: ${answerContent.sources.join(", ")}`);
  }
  return lines.join("\n");
}

/** Converte a mensagem do protótipo para o formato do assistant-ui. */
export function toThreadMessage(message: ChatMessage): ThreadMessageLike {
  if (message.role === "user") {
    return {
      id: message.id,
      role: "user",
      content: message.text,
      metadata: { custom: { time: message.time } },
    };
  }
  return {
    id: message.id,
    role: "assistant",
    status: { type: "complete", reason: "unknown" },
    content: [{ type: "text", text: answerToPlainText(message.answer) }],
    metadata: {
      custom: {
        time: message.time,
        answer: message.answer,
        artifactId: message.artifactId,
      },
    },
  };
}

export interface MessageCustom {
  time?: string;
  answer?: AnswerContent;
  artifactId?: string;
}
