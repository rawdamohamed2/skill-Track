"use client";

import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterPillsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export default function FilterPills<T extends string>({ options, value, onChange }: FilterPillsProps<T>) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            badgeVariants({ variant: value === o.value ? "default" : "outline" }),
            "cursor-pointer capitalize",
            value !== o.value && "text-muted-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
