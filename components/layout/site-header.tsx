"use client";

import { NavPill } from "@/components/ui/nav-pill";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { UserMenu } from "./user-menu";

type NavItemKey = "inicio" | "projetos" | "fontes";

const navItems: {
  key: NavItemKey;
  label: string;
  href?: string;
  disabled?: boolean;
}[] = [
  { key: "inicio", label: "Início", href: "/" },
  { key: "projetos", label: "Projetos", href: "/projetos" },
  { key: "fontes", label: "Fontes de Dados", href: "/fontes-de-dados" },
];

function getActiveItem(pathname: string): NavItemKey | null {
  if (pathname.startsWith("/projetos")) return "projetos";
  if (pathname.startsWith("/fontes-de-dados")) return "fontes";
  if (pathname === "/") return "inicio";
  return null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const activeItem = getActiveItem(pathname);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget)
      .get("q")
      ?.toString()
      .trim();
    router.push(value ? `/projetos?q=${encodeURIComponent(value)}` : "/projetos");
  }

  return (
    <header className="h-20 w-full border-b border-border-default bg-surface">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center px-4 lg:pl-[39px] lg:pr-[61px]">
        <Link href="/" aria-label="ir para a página inicial">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG exportado do Figma; atributos root de largura/altura preservados */}
          <img 
            src="/figma/logo-sigdata.svg"
            alt="SIGDATA — Plataforma de BI"
            width={160}
            height={80}
            className="block shrink-0"
          />
        </Link>
        <div className="ml-7 h-6 w-px bg-border-default" />
        
        <nav aria-label="Navegação principal" className="ml-7 hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavPill
              key={item.key}
              label={item.label}
              href={item.href}
              disabled={item.disabled}
              active={item.key === activeItem}
            />
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <form
            role="search"
            onSubmit={handleSearch}
            className="hidden lg:block"
          >
            <TextField
              size="small"
              name="q"
              placeholder="Pesquisar projetos..."
              className="w-[320px]"
              slotProps={{
                htmlInput: { type: "search", "aria-label": "Pesquisar projetos" },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} aria-hidden="true" className="text-muted" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </form>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
