import Card from "@mui/material/Card";
import { ArrowRight, FolderOpen } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ProjectCardProps = {
  title: string;
  description: string;
  meta?: string;
  href?: string;
  icon?: ReactNode;
};

export function ProjectCard({
  title,
  description,
  meta,
  href = "/projetos/projeto-01",
  icon = <FolderOpen size={20} className="text-white" />,
}: ProjectCardProps) {
  return (
    <Card
      component="article"
      className="group flex h-[146px] flex-col justify-between p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand/30! hover:shadow-lg!"
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-brand-accent shadow-sm"
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold leading-normal text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-[1.4] text-text-secondary">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs leading-[1.5] text-muted">
          {meta}
        </p>
        <Button
          variant="neutral"
          size="sm"
          href={href}
          endIcon={
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          }
        >
          Acessar
        </Button>
      </div>
    </Card>
  );
}
