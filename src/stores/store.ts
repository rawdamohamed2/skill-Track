import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Skill,
  Milestone,
  Project,
  Application,
  Interview,
  Goal,
  ApplicationStatus,
} from "@/types/types";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function mkMilestones(titles: [string, boolean][]): Milestone[] {
  return titles.map(([title, done]) => ({ id: makeId(), title, done }));
}

interface SkillTrackState {
  skills: Skill[];
  projects: Project[];
  applications: Application[];
  interviews: Interview[];
  goals: Goal[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  addSkill: (data: Omit<Skill, "id" | "createdAt" | "milestones">) => void;
  updateSkill: (
    id: string,
    data: Partial<Omit<Skill, "id" | "createdAt" | "milestones">>,
  ) => void;
  deleteSkill: (id: string) => void;
  addMilestone: (skillId: string, title: string) => void;
  toggleMilestone: (skillId: string, milestoneId: string) => void;
  deleteMilestone: (skillId: string, milestoneId: string) => void;

  addProject: (data: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (
    id: string,
    data: Partial<Omit<Project, "id" | "createdAt">>,
  ) => void;
  deleteProject: (id: string) => void;

  addApplication: (data: Omit<Application, "id" | "createdAt">) => void;
  updateApplication: (
    id: string,
    data: Partial<Omit<Application, "id" | "createdAt">>,
  ) => void;
  deleteApplication: (id: string) => void;
  moveApplication: (id: string, status: ApplicationStatus) => void;

  addInterview: (data: Omit<Interview, "id" | "createdAt">) => void;
  updateInterview: (
    id: string,
    data: Partial<Omit<Interview, "id" | "createdAt">>,
  ) => void;
  deleteInterview: (id: string) => void;

  addGoal: (data: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (
    id: string,
    data: Partial<Omit<Goal, "id" | "createdAt">>,
  ) => void;
  deleteGoal: (id: string) => void;
}

export const useSkillTrackStore = create<SkillTrackState>()(
  persist(
    (set, get) => ({
      skills: [],
      projects: [],
      applications: [],
      interviews: [],
      goals: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      addSkill: (data) =>
        set({
          skills: [
            ...get().skills,
            {
              ...data,
              id: makeId(),
              milestones: [],
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      updateSkill: (id, data) =>
        set({
          skills: get().skills.map((s) =>
            s.id === id ? { ...s, ...data } : s,
          ),
        }),
      deleteSkill: (id) =>
        set({
          skills: get().skills.filter((s) => s.id !== id),
          projects: get().projects.map((p) => ({
            ...p,
            skillIds: p.skillIds.filter((sid) => sid !== id),
          })),
        }),
      addMilestone: (skillId, title) =>
        set({
          skills: get().skills.map((s) =>
            s.id === skillId
              ? {
                  ...s,
                  milestones: [
                    ...s.milestones,
                    { id: makeId(), title, done: false },
                  ],
                }
              : s,
          ),
        }),
      toggleMilestone: (skillId, milestoneId) =>
        set({
          skills: get().skills.map((s) =>
            s.id === skillId
              ? {
                  ...s,
                  milestones: s.milestones.map((m) =>
                    m.id === milestoneId ? { ...m, done: !m.done } : m,
                  ),
                }
              : s,
          ),
        }),
      deleteMilestone: (skillId, milestoneId) =>
        set({
          skills: get().skills.map((s) =>
            s.id === skillId
              ? {
                  ...s,
                  milestones: s.milestones.filter((m) => m.id !== milestoneId),
                }
              : s,
          ),
        }),

      addProject: (data) =>
        set({
          projects: [
            ...get().projects,
            { ...data, id: makeId(), createdAt: new Date().toISOString() },
          ],
        }),
      updateProject: (id, data) =>
        set({
          projects: get().projects.map((p) =>
            p.id === id ? { ...p, ...data } : p,
          ),
        }),
      deleteProject: (id) =>
        set({ projects: get().projects.filter((p) => p.id !== id) }),

      addApplication: (data) =>
        set({
          applications: [
            ...get().applications,
            { ...data, id: makeId(), createdAt: new Date().toISOString() },
          ],
        }),
      updateApplication: (id, data) =>
        set({
          applications: get().applications.map((a) =>
            a.id === id ? { ...a, ...data } : a,
          ),
        }),
      deleteApplication: (id) =>
        set({ applications: get().applications.filter((a) => a.id !== id) }),
      moveApplication: (id, status) =>
        set({
          applications: get().applications.map((a) =>
            a.id === id ? { ...a, status } : a,
          ),
        }),

      addInterview: (data) =>
        set({
          interviews: [
            ...get().interviews,
            { ...data, id: makeId(), createdAt: new Date().toISOString() },
          ],
        }),
      updateInterview: (id, data) =>
        set({
          interviews: get().interviews.map((i) =>
            i.id === id ? { ...i, ...data } : i,
          ),
        }),
      deleteInterview: (id) =>
        set({ interviews: get().interviews.filter((i) => i.id !== id) }),

      addGoal: (data) =>
        set({
          goals: [
            ...get().goals,
            { ...data, id: makeId(), createdAt: new Date().toISOString() },
          ],
        }),
      updateGoal: (id, data) =>
        set({
          goals: get().goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
        }),
      deleteGoal: (id) =>
        set({ goals: get().goals.filter((g) => g.id !== id) }),
    }),
    {
      name: "skilltrack-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
