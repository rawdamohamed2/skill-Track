"use client";

import Link from "next/link";
import type { Skill } from "@/types/types";
import { CATEGORY_ACCENT, SKILL_STATUS_LABELS } from "@/types/types";
import LevelRing from "./LevelRing";
import { skillProgress } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface SkillCardProps {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_DOT: Record<Skill["status"], string> = {
  "not-started": "var( --chart-2)",
  learning: "var(--chart-3)",
  mastered: "var(--chart-5)",
};

export default function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  const percent = skillProgress(skill);
  const accent = CATEGORY_ACCENT[skill.category];
  const done = skill.milestones.filter((m) => m.done).length;

  return (
    <Card className="group relative">
      <Link
        href={`/skills/${skill.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Open ${skill.name}`}
      />

      <CardHeader>
        <div className="min-w-0 pr-2">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-faint">
            {skill.category}
          </p>
          <div className="flex gap-2 justify-between items-center">
            <CardTitle className="truncate">{skill.name}</CardTitle>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: STATUS_DOT[skill.status] }}
              />
              <span className="text-xs text-muted-foreground">
                {SKILL_STATUS_LABELS[skill.status]}
              </span>
            </div>
          </div>
        </div>
        <div className={`relative sm:start-30 start-10 `}>
          <LevelRing percent={percent} accent={accent} />
        </div>
      </CardHeader>

      <CardContent />

      <CardFooter className={`justify-between`}>
        <span className="font-mono text-faint">
          {skill.milestones.length > 0
            ? `${done}/${skill.milestones.length} milestones`
            : "No roadmap yet"}
        </span>
        <div className="relative z-20 flex gap-3 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
            className="editBtn"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="deleteBtn"
          >
            Delete
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
