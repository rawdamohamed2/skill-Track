"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { milestoneSchema, type MilestoneFormValues } from "@/schemas/schema";
import type { Milestone } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MilestoneListProps {
  milestones: Milestone[];
  accent: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (title: string) => void;
}

export default function MilestoneList({
  milestones,
  accent,
  onToggle,
  onDelete,
  onAdd,
}: MilestoneListProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MilestoneFormValues>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: { title: "" },
  });

  const submit = (values: MilestoneFormValues) => {
    onAdd(values.title);
    reset({ title: "" });
  };

  return (
    <div>
      <div className="space-y-2">
        {milestones.map((m, i) => (
          <div
            key={m.id}
            className="group flex items-center gap-3 rounded-md border border-line-soft bg-panel-raised px-3 py-2.5"
          >
            <span className="w-5 shrink-0 font-mono text-[11px] text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <button
              onClick={() => onToggle(m.id)}
              aria-pressed={m.done}
              aria-label={
                m.done
                  ? `Mark "${m.title}" incomplete`
                  : `Mark "${m.title}" complete`
              }
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded border transition"
              style={{
                borderColor: m.done ? accent : "var(--border-line)",
                backgroundColor: m.done ? accent : "transparent",
              }}
            >
              {m.done && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6L5 8.5L9.5 3.5"
                    stroke="var(--bg-void)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span
              className={`flex-1 text-sm ${m.done ? "text-faint line-through" : "text-primary"}`}
            >
              {m.title}
            </span>
            <button
              onClick={() => onDelete(m.id)}
              aria-label={`Remove "${m.title}"`}
              className="text-faint opacity-0 transition hover:text-destructive group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {milestones.length === 0 && (
          <div className="rounded-md border border-dashed border-line-soft px-3 py-6 text-center text-xs text-faint">
            No roadmap steps yet. Add the first one below.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(submit)} className="mt-3 flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            {...register("title")}
            placeholder="Add a roadmap step"
            aria-label="Add a roadmap step"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>
        <Button type="submit" variant="outline" className="shrink-0">
          Add step
        </Button>
      </form>
    </div>
  );
}
