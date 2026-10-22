import type { Metadata } from "next";
import { PageFooter } from "@/components/layout/page-footer";
import { SettingsView } from "@/components/config/settings-view";

export const metadata: Metadata = {
  title: "Configurações | SIGDATA",
  description: "Perfil, preferências e administração do espaço de trabalho.",
};

const container = "mx-auto w-full max-w-[1440px] px-4 lg:px-[33px]";

export default function ConfiguracoesPage() {
  return (
    <main className="flex w-full flex-1 flex-col items-start gap-6">
      <header className={`${container} mt-15`}>
        <h1 className="text-[28px] font-bold leading-[1.5] text-ink">
          Configurações
        </h1>
        <p className="mt-1 text-sm leading-[1.5] text-muted">
          Perfil, preferências e telas demonstrativas de administração.
        </p>
      </header>

      <section aria-label="Configurações da conta" className={container}>
        <SettingsView />
      </section>

      <footer className={`${container} pb-8`}>
        <PageFooter />
      </footer>
    </main>
  );
}
