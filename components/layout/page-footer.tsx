import { CircleHelp } from "lucide-react";

export function PageFooter() {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-xs leading-normal text-muted">
        Ambiente de demonstração • Nenhum dado real é exibido.
      </p>
      <div className="flex items-center gap-[7px]">
        <CircleHelp size={14} aria-hidden="true" className="text-muted" />
        <p className="text-xs leading-normal text-muted">Precisa de ajuda?</p>
      </div>
    </div>
  );
}
