import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

/**
 * 404 para URLs que não casam com nenhuma rota (convenção
 * `global-not-found`, com `experimental.globalNotFound`).
 * Bypassa o layout raiz, por isso declara html/body e importa os styles.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Página não encontrada | SIGDATA",
  description: "O endereço acessado não existe.",
};

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center font-sans text-ink">
        <p className="text-sm font-semibold leading-[1.5] text-brand">SIGDATA</p>
        <h1 className="text-[28px] font-bold leading-[1.5] text-ink">Erro 404</h1>
        <p className="max-w-[420px] text-sm leading-[1.6] text-muted">
          Página não encontrada. O endereço pode estar incorreto ou a página
          foi movida.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-accent"
        >
          Voltar ao início
        </Link>
      </body>
    </html>
  );
}
