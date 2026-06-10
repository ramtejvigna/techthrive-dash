"use client";

import { PRESET_BUCKET_COLORS } from "@/lib/kanban-themes";
import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState } from "react";

interface ColumnColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColumnColorPicker({ color, onChange }: ColumnColorPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((value) => !value)}
        className="flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-black/5 transition-transform hover:scale-110"
        style={{ backgroundColor: color }}
        aria-label="Choose bucket color"
        aria-expanded={open}
      />

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[188px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Bucket color
          </p>
          <div className="mb-3 grid grid-cols-4 gap-2">
            {PRESET_BUCKET_COLORS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  onChange(preset);
                  setOpen(false);
                }}
                className={cn(
                  "h-7 w-7 rounded-full ring-1 ring-black/5 transition-transform hover:scale-105",
                  preset === color && "ring-2 ring-[var(--accent)] ring-offset-1",
                )}
                style={{ backgroundColor: preset }}
                aria-label={`Use color ${preset}`}
              />
            ))}
          </div>
          <label
            htmlFor={inputId}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-hover)]"
          >
            <span className="shrink-0">Custom</span>
            <input
              id={inputId}
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="h-7 w-full cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </label>
        </div>
      )}
    </div>
  );
}
