import { createStore, useStore } from "./store";

/** Resultados salvos pelo assistente (memória da sessão, prévia do projeto). */
export interface SavedResult {
  id: string;
  title: string;
  time: string;
}

const store = createStore<SavedResult[]>([]);

export function useSavedResults(): SavedResult[] {
  return useStore(store);
}

let counter = 0;

/** Salva um resultado do chat nos resultados do projeto (em memória). */
export function saveResult(title: string): void {
  counter += 1;
  const time = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  store.set((prev) => [{ id: `r-${Date.now()}-${counter}`, title, time }, ...prev]);
}
