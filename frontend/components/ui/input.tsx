import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="tech-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 font-mono text-sm text-[var(--foreground)] outline-none transition-all duration-150 placeholder:text-[var(--muted-light)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/15",
          className,
        )}
        {...props}
      />
      {error && <p className="font-mono text-xs text-red-500">{error}</p>}
    </div>
  );
}
