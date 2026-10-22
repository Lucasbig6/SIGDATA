import { createStore, useStore } from "./store";
import { seedPanels, type PanelWidget, type ProjectPanel } from "./panels-store-data";

/** Painéis da sessão: seeds + criados/editados na demo. */
const store = createStore<ProjectPanel[]>(seedPanels);

export function useProjectPanels(): ProjectPanel[] {
  return useStore(store);
}

let counter = 0;

function formatNow(): string {
  return new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function addPanel(input: {
  projectId: string;
  title: string;
  template: "vazio" | "resumo";
}): ProjectPanel {
  counter += 1;
  const widgets: PanelWidget[] =
    input.template === "resumo"
      ? [
          { id: `w-${Date.now()}-1`, kind: "kpi", title: "Indicador principal" },
          { id: `w-${Date.now()}-2`, kind: "grafico", title: "Evolução no período" },
        ]
      : [];

  const panel: ProjectPanel = {
    id: `pp-${Date.now()}-${counter}`,
    projectId: input.projectId,
    title: input.title.trim(),
    status: "rascunho",
    updatedAt: formatNow(),
    layout: "2",
    widgets,
  };
  store.set((prev) => [panel, ...prev]);
  return panel;
}

export function updatePanel(
  id: string,
  patch: Partial<Omit<ProjectPanel, "id" | "projectId">>,
): void {
  store.set((prev) =>
    prev.map((panel) =>
      panel.id === id ? { ...panel, ...patch, updatedAt: formatNow() } : panel,
    ),
  );
}

export function removePanel(id: string): void {
  store.set((prev) => prev.filter((panel) => panel.id !== id));
}

export function addWidget(
  panelId: string,
  widget: Omit<PanelWidget, "id">,
): void {
  counter += 1;
  store.set((prev) =>
    prev.map((panel) =>
      panel.id === panelId
        ? {
            ...panel,
            updatedAt: formatNow(),
            widgets: [
              ...panel.widgets,
              { ...widget, id: `w-${Date.now()}-${counter}` },
            ],
          }
        : panel,
    ),
  );
}

export function removeWidget(panelId: string, widgetId: string): void {
  store.set((prev) =>
    prev.map((panel) =>
      panel.id === panelId
        ? {
            ...panel,
            updatedAt: formatNow(),
            widgets: panel.widgets.filter((widget) => widget.id !== widgetId),
          }
        : panel,
    ),
  );
}

export function moveWidget(
  panelId: string,
  widgetId: string,
  direction: -1 | 1,
): void {
  store.set((prev) =>
    prev.map((panel) => {
      if (panel.id !== panelId) return panel;
      const index = panel.widgets.findIndex((widget) => widget.id === widgetId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= panel.widgets.length) return panel;
      const widgets = [...panel.widgets];
      [widgets[index], widgets[target]] = [widgets[target], widgets[index]];
      return { ...panel, widgets, updatedAt: formatNow() };
    }),
  );
}
