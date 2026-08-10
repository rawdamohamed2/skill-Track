import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Skill } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function skillProgress(skill: Skill): number {
  if (skill.milestones.length === 0) {
    return skill.status === "mastered" ? 100 : 0;
  }

  const completed = skill.milestones.filter(
    (milestone) => milestone.done,
  ).length;

  return Math.round((completed / skill.milestones.length) * 100);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function daysUntil(date: string | Date): number {
  const target = new Date(date);
  const today = new Date();

  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference = target.getTime() - today.getTime();

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}
