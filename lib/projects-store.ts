import { projects as baseProjects, type Project } from "./projects-data";
import { createStore, useStore } from "./store";

/** Lista viva de projetos: mocks da sessão + projetos criados na demo. */
const store = createStore<Project[]>(baseProjects);

export function useProjects(): Project[] {
  return useStore(store);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** Cria um projeto em memória (chamar apenas em handlers de usuário). */
export function addProject(input: {
  title: string;
  description?: string;
}): Project {
  const base = slugify(input.title) || "projeto-novo";
  let id = base;
  let counter = 2;
  while (store.get().some((project) => project.id === id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }

  const updatedDate = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const project: Project = {
    id,
    title: input.title.trim(),
    description:
      input.description?.trim() ||
      "Projeto criado no ambiente de demonstração.",
    meta: `${updatedDate} · 0 fontes`,
    updatedDate,
    updatedMeta: "agora mesmo",
    sources: 0,
    href: `/projetos/${id}`,
  };

  store.set((prev) => [project, ...prev]);
  return project;
}
