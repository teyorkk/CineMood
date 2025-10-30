"use client";
import * as RSelect from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { clsx } from "clsx";

export type Option = { value: string; label: string; disabled?: boolean };

export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <RSelect.Root value={value} onValueChange={onValueChange}>
      <RSelect.Trigger
        className={clsx(
          "inline-flex items-center justify-between gap-2 w-full rounded-md border border-zinc-200 dark:border-white/10",
          "bg-white/60 dark:bg-white/5 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10",
          "data-[state=open]:ring-2 data-[state=open]:ring-indigo-500/50",
          className
        )}
        aria-label={placeholder}
      >
        <RSelect.Value placeholder={placeholder} />
        <RSelect.Icon>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={6}
          className={clsx(
            "z-50 min-w-48 overflow-hidden rounded-md border border-zinc-200 dark:border-white/10",
            "bg-white dark:bg-zinc-900 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        >
          <RSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RSelect.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className={clsx(
                  "group relative flex w-full select-none items-center rounded-sm px-3 py-2 text-sm outline-none",
                  "data-disabled:pointer-events-none data-disabled:opacity-40",
                  "data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 dark:data-highlighted:bg-zinc-800 dark:data-highlighted:text-zinc-50",
                  "data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700 dark:data-[state=checked]:bg-indigo-500/20 dark:data-[state=checked]:text-indigo-100"
                )}
              >
                <RSelect.ItemText className="mr-6 truncate">{opt.label}</RSelect.ItemText>
                <RSelect.ItemIndicator className="absolute right-2 inline-flex items-center text-indigo-600 dark:text-indigo-300">
                  <Check className="h-4 w-4" />
                </RSelect.ItemIndicator>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}
