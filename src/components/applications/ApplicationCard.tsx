"use client";

import type { Application } from "@/types/types";
import { formatDate } from "@/lib/utils";

interface ApplicationCardProps {
  application: Application;
  onOpen: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

export default function ApplicationCard({
  application,
  onOpen,
  onDragStart,
}: ApplicationCardProps) {
  return (
    <button
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className="w-full cursor-grab rounded-md border border-line bg-panel-raised p-3 text-left transition hover:border-line-soft hover:bg-panel-hover active:cursor-grabbing"
    >
      <p className="text-sm text-primary">{application.company}</p>
      <p className="mt-0.5 text-xs text-muted">{application.role}</p>
      {application.appliedDate && (
        <p className="mt-2 font-mono text-[11px] text-faint">
          Applied {formatDate(application.appliedDate)}
        </p>
      )}
    </button>
  );
}
