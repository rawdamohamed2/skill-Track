export type SkillStatus = "not-started" | "learning" | "mastered";

export const SKILL_STATUS_LABELS: Record<SkillStatus, string> = {
  "not-started": "Not started",
  learning: "Learning",
  mastered: "Mastered",
};

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Language",
  "DevOps",
  "Database",
  "Tooling",
  "Soft skill",
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  status: SkillStatus;
  notes: string;
  milestones: Milestone[];
  createdAt: string;
}

export type ProjectStatus = "planned" | "in-progress" | "completed";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  completed: "Completed",
};

export interface Project {
  id: string;
  title: string;
  description: string;
  skillIds: string[];
  status: ProjectStatus;
  link: string;
  createdAt: string;
}

export type ApplicationStatus = "wishlist" | "applied" | "interviewing" | "offer" | "rejected";

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "rejected",
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  link: string;
  notes: string;
  createdAt: string;
}

export type InterviewType = "technical" | "behavioral" | "system-design" | "take-home";

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  technical: "Technical",
  behavioral: "Behavioral",
  "system-design": "System design",
  "take-home": "Take-home",
};

export type InterviewStatus = "upcoming" | "completed";

export interface Interview {
  id: string;
  company: string;
  type: InterviewType;
  status: InterviewStatus;
  date: string;
  notes: string;
  createdAt: string;
}

export type GoalStatus = "active" | "completed";

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: GoalStatus;
  progress: number; // 0-100
  createdAt: string;
}

export const CATEGORY_ACCENT: Record<SkillCategory, string> = {
  Frontend: "#6ee7a8",
  Backend: "#5aa9e6",
  Language: "#f2b84b",
  DevOps: "#e2637a",
  Database: "#9b8cf2",
  Tooling: "#6ee7a8",
  "Soft skill": "#f2b84b",
};
