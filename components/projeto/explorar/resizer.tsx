"use client";

import type { PointerEvent as ReactPointerEvent } from "react";

type ResizerProps = {
  label: string;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

/** Divisória arrastável entre painéis (pointer capture, sem dependências). */
export function Resizer({ label, onPointerDown, onPointerMove, onPointerUp }: ResizerProps) {
  return (
    <div
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      tabIndex={-1}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="group hidden w-2 shrink-0 cursor-col-resize touch-none items-center justify-center outline-none xl:flex"
    >
      <span className="h-12 w-[3px] rounded-full bg-line transition-colors group-hover:bg-brand group-focus-visible:bg-brand" />
    </div>
  );
}
