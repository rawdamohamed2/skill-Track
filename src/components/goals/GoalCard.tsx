"use client";

import type { Goal } from "@/types/types";
import { formatDate, daysUntil } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GoalCardProps {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
}

export default function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const until = goal.targetDate ? daysUntil(goal.targetDate) : NaN;
  const accent =
    goal.status === "completed" ? "var(--chart-2)" : "var(--chart-2)";

  return (
    <Card className="group">
      <CardHeader>
        <div>
          <div className="flex items-center justify-between">
            <CardTitle>{goal.title}</CardTitle>
            {goal.status === "completed" && (
              <Badge
                className="whitespace-nowrap"
                style={{
                  borderColor: "var(--card)",
                  color: "var(--card)",
                }}
              >
                Done
              </Badge>
            )}
          </div>
          {goal.description && (
            <CardDescription className="mt-1">
              {goal.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-mono text-faint">
            {Math.round(goal.progress)}%
          </span>
          {goal.targetDate && (
            <span className="font-mono text-faint">
              {formatDate(goal.targetDate)}
              {goal.status !== "completed" &&
                !Number.isNaN(until) &&
                ` · ${until >= 0 ? `${until}d left` : `${Math.abs(until)}d over`}`}
            </span>
          )}
        </div>
        <div className="h-1.5 bg-border w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.max(0, Math.min(100, goal.progress))}%`,
              backgroundColor: accent,
            }}
          />
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <div className="flex gap-3 opacity-0 transition group-hover:opacity-100">
          <button onClick={onEdit} className="editBtn">
            Edit
          </button>
          <button onClick={onDelete} className="deleteBtn">
            Delete
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
