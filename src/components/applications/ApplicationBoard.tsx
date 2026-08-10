"use client";

import { useState } from "react";
import type { Application, ApplicationStatus } from "@/types/types";
import {
  APPLICATION_STATUS_ORDER,
  APPLICATION_STATUS_LABELS,
} from "@/types/types";
import ApplicationCard from "./ApplicationCard";
import { Button } from "@/components/ui/button";

interface ApplicationBoardProps {
  applications: Application[];
  onOpen: (app: Application) => void;
  onAdd: (status: ApplicationStatus) => void;
  onMove: (id: string, status: ApplicationStatus) => void;
}

const STATUS_ACCENT: Record<ApplicationStatus, string> = {
  wishlist: "var(--chart-1)",
  applied: "var(--primary)",
  interviewing: "var(--secondary)",
  offer: "var(--tertiary)",
  rejected: "var(--destructive)",
};

export default function ApplicationBoard({
  applications,
  onOpen,
  onAdd,
  onMove,
}: ApplicationBoardProps) {
  const [dragOver, setDragOver] = useState<ApplicationStatus | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {APPLICATION_STATUS_ORDER.map((status) => {
        const items = applications.filter((a) => a.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(status);
            }}
            onDragLeave={() => setDragOver((s) => (s === status ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              if (id) onMove(id, status);
              setDragOver(null);
            }}
            className={`flex min-h-[200px] flex-col rounded-lg border p-3 transition ${
              dragOver === status
                ? "border-xp bg-panel-hover"
                : "border-line-soft bg-panel/40"
            }`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="flex items-center gap-1.5 font-display text-sm text-primary">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: STATUS_ACCENT[status] }}
                />
                {APPLICATION_STATUS_LABELS[status]}
              </h3>
              <span className="rounded-full border border-line px-2 py-0.5 font-mono text-xs text-muted">
                {items.length}
              </span>
            </div>

            <div className="flex-1 space-y-2">
              {items.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onOpen={() => onOpen(app)}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", app.id);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                />
              ))}
              {items.length === 0 && (
                <div className="rounded-md border border-dashed border-line-soft px-3 py-5 text-center text-xs text-faint">
                  Nothing here
                </div>
              )}
            </div>

            <Button
              onClick={() => onAdd(status)}
              variant="outline"
              size="sm"
              className="mt-3 w-full justify-start border-dashed text-muted-foreground hover:border-solid hover:text-foreground"
            >
              + Add
            </Button>
          </div>
        );
      })}
    </div>
  );
}
