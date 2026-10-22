import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFooter } from "@/components/layout/page-footer";
import { ProjectDetail } from "@/components/projeto/project-detail";
import { projectById, projects } from "@/lib/projects-data";

/**
 * Rotas estáticas para os projetos mockados; ids válidos criados na sessão
 * (estado em memória) e desconhecidos são resolvidos no cliente.
 */
export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projectById(id);
  return {
    title: project ? `${project.title} | SIGDATA` : "Projeto | SIGDATA",
    description: project?.description,
  };
}

export default async function ProjetoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Slugs fora do formato dos ids do protótipo caem no 404.
  if (!/^[a-z0-9-]+$/.test(id)) {
    notFound();
  }

  return (
    <>
      <ProjectDetail projectId={id} />
      <PageFooter />
    </>
  );
}
