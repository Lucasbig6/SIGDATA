"use client";

import MuiButton from "@mui/material/Button";
import Link from "next/link";

type NavPillProps = {
  label: string;
  active?: boolean;
  href?: string;
  disabled?: boolean;
};

function pillClassName(active: boolean) {
  return `min-w-0 whitespace-nowrap ${
    active ? "rounded-[5px] bg-pill-active" : "rounded-lg"
  }`;
}

export function NavPill({ label, active = false, href, disabled }: NavPillProps) {
  if (disabled) {
    return (
      <MuiButton disabled size="small" color="inherit" className={pillClassName(active)}>
        {label}
      </MuiButton>
    );
  }

  if (href) {
    return (
      <MuiButton
        component={Link}
        href={href}
        size="small"
        color="inherit"
        aria-current={active ? "page" : undefined}
        className={pillClassName(active)}
      >
        {label}
      </MuiButton>
    );
  }

  return (
    <MuiButton
      size="small"
      color="inherit"
      aria-current={active ? "page" : undefined}
      className={pillClassName(active)}
    >
      {label}
    </MuiButton>
  );
}
