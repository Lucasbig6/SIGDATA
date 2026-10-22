import { seedAnalyses, type Analysis } from "./analyses-data";
import { createStore, useStore } from "./store";

/** Análises da sessão: seeds + criadas/editadas na demo. */
const store = createStore<Analysis[]>(seedAnalyses);

export function useAnalyses(): Analysis[] {
  return useStore(store);
}

let counter = 0;

/** Cria uma análise em rascunho (chamar em handlers). */
export function addAnalysis(
  input: Omit<Analysis, "id" | "updatedAt" | "published"> & {
    published?: boolean;
  },
): Analysis {
  counter += 1;
  const analysis: Analysis = {
    published: false,
    ...input,
    id: `an-${Date.now()}-${counter}`,
    updatedAt: formatNow(),
  };
  store.set((prev) => [analysis, ...prev]);
  return analysis;
}

/** Atualiza uma análise existente (só quando o usuário salva). */
export function updateAnalysis(
  id: string,
  patch: Partial<Omit<Analysis, "id" | "projectId">>,
): void {
  store.set((prev) =>
    prev.map((analysis) =>
      analysis.id === id
        ? { ...analysis, ...patch, updatedAt: formatNow() }
        : analysis,
    ),
  );
}

export function removeAnalysis(id: string): void {
  store.set((prev) => prev.filter((analysis) => analysis.id !== id));
}

/** Timestamp sempre em handlers (nunca no render — cacheComponents). */
function formatNow(): string {
  return new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
