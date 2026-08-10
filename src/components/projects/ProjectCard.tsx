"use client";

import type { Project, Skill } from "@/types/types";
import { PROJECT_STATUS_LABELS } from "@/types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_COLOR: Record<Project["status"], string> = {
  planned: "var(--tertiary)",
  "in-progress": "var(--chart-5)",
  completed: "var(--chart-2)",
};

interface ProjectCardProps {
  project: Project;
  skills: Skill[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectCard({
  project,
  skills,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const linkedSkills = skills.filter((s) => project.skillIds.includes(s.id));

  return (
    <Card className="group hover:scale-105 transition-all duration-200">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle className="truncate">{project.title}</CardTitle>
          {project.description && (
            <CardDescription className="mt-1 line-clamp-2">
              {project.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {linkedSkills.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {linkedSkills.map((s) => (
              <span
                key={s.id}
                className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {s.name}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className={`justify-between`}>
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="text-blue hover:underline"
          >
            View project ↗
          </a>
        ) : (
          <span />
        )}
        <div className="flex gap-3 opacity-0 transition group-hover:opacity-100">
          <button onClick={onEdit} className="editBtn">
            Edit
          </button>
          <button onClick={onDelete} className="deleteBtn">
            Delete
          </button>
        </div>

        <Badge
          className="bg-sidebar-border whitespace-nowrap"
          style={{
            borderColor: STATUS_COLOR[project.status],
            color: STATUS_COLOR[project.status],
          }}
        >
          {PROJECT_STATUS_LABELS[project.status]}
        </Badge>
      </CardFooter>
    </Card>
  );
}
