"use client";

import type { Interview } from "@/types/types";
import { INTERVIEW_TYPE_LABELS } from "@/types/types";
import { formatDate, daysUntil } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TYPE_ACCENT: Record<Interview["type"], string> = {
  technical: "var(--chart-1)",
  behavioral: "var(--chart-5)",
  "system-design": "var(--chart-4)",
  "take-home": "var(--tertiary-container)",
};

interface InterviewCardProps {
  interview: Interview;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InterviewCard({
  interview,
  onEdit,
  onDelete,
}: InterviewCardProps) {
  const until = interview.date ? daysUntil(interview.date) : NaN;

  return (
    <Card className="group hover:scale-105 transition-all duration-200">
      <CardHeader className={`relative`}>
        <div className={`flex justify-between gap-2 pb-2`}>
          <CardTitle>{interview.company}</CardTitle>
          {interview.date && (
            <div className="text-right">
              <p className="font-mono text-xs text-muted-foreground">
                {formatDate(interview.date)}
              </p>
              {interview.status === "upcoming" && !Number.isNaN(until) && (
                <p className="font-mono text-[11px] text-faint">
                  {until === 0
                    ? "today"
                    : until > 0
                      ? `in ${until}d`
                      : `${Math.abs(until)}d ago`}
                </p>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {interview.notes && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {interview.notes}
          </p>
        )}
      </CardContent>

      <CardFooter className={`justify-between`}>
        <span
          className={`font-mono ${interview.status === "upcoming" ? "text-amber" : "text-faint"}`}
        >
          {interview.status === "upcoming" ? "Upcoming" : "Completed"}
        </span>

        <div className="flex gap-3 opacity-0 transition group-hover:opacity-100">
          <button onClick={onEdit} className="editBtn">
            Edit
          </button>
          <button onClick={onDelete} className="deleteBtn">
            Delete
          </button>
        </div>

        <Badge
          className="mt-1 bg-sidebar-border"
          style={{
            borderColor: TYPE_ACCENT[interview.type],
            color: TYPE_ACCENT[interview.type],
          }}
        >
          {INTERVIEW_TYPE_LABELS[interview.type]}
        </Badge>
      </CardFooter>
    </Card>
  );
}
