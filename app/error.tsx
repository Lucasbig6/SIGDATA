"use client";

// Error boundaries must be Client Components.
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    // Registrado apenas no console (protótipo sem serviço de telemetria).
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-error-bg">
        <TriangleAlert size={24} aria-hidden="true" className="text-error" />
      </span>
      <h1 className="text-2xl font-bold leading-[1.5] text-ink">
        Algo deu errado
      </h1>
      <p className="text-sm leading-[1.6] text-muted">
        Ocorreu um erro inesperado ao renderizar esta tela. Tente novamente —
        no protótipo, os dados criados nesta sessão são preservados.
      </p>
      <Button variant="primary" size="md" onClick={retry}>
        Tentar novamente
      </Button>
    </main>
  );
}
