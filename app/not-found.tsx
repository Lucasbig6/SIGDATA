import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-warning-bg">
        <TriangleAlert size={26} aria-hidden="true" className="text-warning" />
      </span>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-semibold uppercase leading-[1.5] tracking-wider text-muted">
          Erro 404
        </p>
        <h1 className="text-[28px] font-bold leading-[1.5] text-ink">
          Página não encontrada
        </h1>
        <p className="max-w-[440px] text-sm leading-[1.5] text-muted">
          O endereço acessado não existe ou ainda não foi incluído neste
          ambiente de demonstração.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button href="/" variant="primary" size="md">
          Ir para o início
        </Button>
        <Button href="/projetos" variant="subtle" size="md">
          Ver projetos
        </Button>
      </div>
    </main>
  );
}
