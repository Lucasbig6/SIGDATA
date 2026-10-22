import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton exibido ao navegar para /projetos e /projetos/[id]. */
export default function ProjetosLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-8 lg:px-[33px]"
    >
      <Skeleton className="h-9 w-44" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[146px] w-full" />
        <Skeleton className="h-[146px] w-full" />
        <Skeleton className="h-[146px] w-full" />
      </div>
      <span className="sr-only">Carregando projetos…</span>
    </div>
  );
}
