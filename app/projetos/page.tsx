import type { Metadata } from "next";
import { PageFooter } from "@/components/layout/page-footer";
import { ProjectsPageContent } from "@/components/projeto/projects-page-content";

export const metadata: Metadata = {
  title: "Projetos | SIGDATA",
  description: "Explore seus projetos de análise de dados.",
};

export default function ProjetosPage() {
  return (
    <>
      <ProjectsPageContent />
      <PageFooter />
    </>
  );
}
