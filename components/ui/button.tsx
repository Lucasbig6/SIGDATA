"use client";

import MuiButton from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "neutral" | "subtle";
type ButtonSize = "sm" | "md";

const variantProps = {
  primary: { variant: "contained", color: "primary" },
  neutral: { variant: "contained", color: "neutral" },
  subtle: { variant: "text", color: "inherit" },
} as const;

const sizeMap = { sm: "small", md: "medium" } as const;

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  sx?: SxProps<Theme>;
};

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "color"> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "color"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  startIcon,
  endIcon,
  sx,
  ...rest
}: ButtonProps) {
  const { variant: muiVariant, color: muiColor } = variantProps[variant];
  const muiSize = sizeMap[size];

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest;
    return (
      <MuiButton
        component={Link}
        href={href}
        variant={muiVariant}
        color={muiColor}
        size={muiSize}
        className={className}
        startIcon={startIcon}
        endIcon={endIcon}
        sx={sx}
        {...anchorProps}
      >
        {children}
      </MuiButton>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<
    ButtonAsButton,
    keyof SharedProps
  >;
  return (
    <MuiButton
      type={type}
      variant={muiVariant}
      color={muiColor}
      size={muiSize}
      className={className}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={sx}
      {...buttonProps}
    >
      {children}
    </MuiButton>
  );
}
