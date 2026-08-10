import { z } from "zod";
import { SKILL_CATEGORIES } from "../types/types";

export const skillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name needs at least 2 characters.")
    .max(50, "Keep it under 50 characters."),
  category: z.enum(SKILL_CATEGORIES),
  status: z.enum(["not-started", "learning", "mastered"]),
  notes: z
    .string()
    .trim()
    .max(300, "Keep notes under 300 characters.")
    .optional()
    .or(z.literal("")),
});
export type SkillFormValues = z.infer<typeof skillSchema>;

export const milestoneSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Milestone needs at least 2 characters.")
    .max(80, "Keep it under 80 characters."),
});
export type MilestoneFormValues = z.infer<typeof milestoneSchema>;

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title needs at least 2 characters.")
    .max(70, "Keep it under 70 characters."),
  description: z
    .string()
    .trim()
    .max(300, "Keep it under 300 characters.")
    .optional()
    .or(z.literal("")),
  status: z.enum(["planned", "in-progress", "completed"]),
  skillIds: z.array(z.string()),
  link: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^https?:\/\/.+/i.test(v),
      "Link must start with http:// or https://",
    ),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

export const applicationSchema = z.object({
  company: z
    .string()
    .trim()
    .min(2, "Company needs at least 2 characters.")
    .max(60, "Keep it under 60 characters."),
  role: z
    .string()
    .trim()
    .min(2, "Role needs at least 2 characters.")
    .max(60, "Keep it under 60 characters."),
  status: z.enum(["wishlist", "applied", "interviewing", "offer", "rejected"]),
  appliedDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Enter a valid date."),
  link: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^https?:\/\/.+/i.test(v),
      "Link must start with http:// or https://",
    ),
  notes: z
    .string()
    .trim()
    .max(300, "Keep notes under 300 characters.")
    .optional()
    .or(z.literal("")),
});
export type ApplicationFormValues = z.infer<typeof applicationSchema>;

export const interviewSchema = z.object({
  company: z
    .string()
    .trim()
    .min(2, "Company needs at least 2 characters.")
    .max(60, "Keep it under 60 characters."),
  type: z.enum(["technical", "behavioral", "system-design", "take-home"]),
  status: z.enum(["upcoming", "completed"]),
  date: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Enter a valid date."),
  notes: z
    .string()
    .trim()
    .max(300, "Keep notes under 300 characters.")
    .optional()
    .or(z.literal("")),
});
export type InterviewFormValues = z.infer<typeof interviewSchema>;

export const goalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title needs at least 2 characters.")
    .max(70, "Keep it under 70 characters."),
  description: z
    .string()
    .trim()
    .max(300, "Keep it under 300 characters.")
    .optional()
    .or(z.literal("")),
  targetDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Enter a valid date."),
  status: z.enum(["active", "completed"]),
  progress: z.number().min(0, "0 to 100 only.").max(100, "0 to 100 only."),
});
export type GoalFormValues = z.infer<typeof goalSchema>;
