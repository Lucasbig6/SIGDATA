import Link from "next/link";
import { FolderOpen } from "lucide-react";

type FeaturedCardProps = {
  title: string;
  meta: string;
  href?: string;
};

export function FeaturedCard({
  title,
  meta,
  href = "/projetos",
}: FeaturedCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-[210px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-accent p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        aria-hidden="true"
        className="absolute -right-8 -top-10 size-40 rounded-full bg-white/5"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-14 -left-10 size-36 rounded-full bg-white/5"
      />
      <FolderOpen
        size={96}
        aria-hidden="true"
        className="absolute right-3 top-8 rotate-12 text-white/10 transition-transform duration-300 group-hover:scale-110"
      />
      <div className="relative">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
          Projeto
        </span>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-white">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-[1.5] text-white/75">{meta}</p>
      </div>
    </Link>
  );
}
