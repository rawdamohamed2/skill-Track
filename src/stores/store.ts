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

const seedSkills: Skill[] = [
  {
    id: "skill-react",
    name: "React",
    category: "Frontend",
    status: "learning",
    notes: "Focused on hooks and component composition this month.",
    milestones: mkMilestones([
      ["Understand components and props", true],
      ["Learn useState and useEffect", true],
      ["Build a custom hook", true],
      ["Understand context and reducers", false],
      ["Learn performance optimization (memo, useMemo)", false],
    ]),
    createdAt: new Date().toISOString(),
  },
  {
    id: "skill-ts",
    name: "TypeScript",
    category: "Language",
    status: "learning",
    notes: "",
    milestones: mkMilestones([
      ["Basic types and interfaces", true],
      ["Generics", true],
      ["Utility types", false],
      ["Advanced narrowing", false],
    ]),
    createdAt: new Date().toISOString(),
  },
  {
    id: "skill-css",
    name: "CSS / Layout",
    category: "Frontend",
    status: "mastered",
    notes: "Comfortable with flexbox, grid, and responsive design.",
    milestones: mkMilestones([
      ["Flexbox", true],
      ["Grid", true],
      ["Responsive breakpoints", true],
      ["Animations and transitions", true],
    ]),
    createdAt: new Date().toISOString(),
  },
  {
    id: "skill-docker",
    name: "Docker",
    category: "DevOps",
    status: "not-started",
    notes: "",
    milestones: mkMilestones([
      ["Understand images vs containers", false],
      ["Write a Dockerfile", false],
      ["Use docker-compose", false],
    ]),
    createdAt: new Date().toISOString(),
  },
];

const seedProjects: Project[] = [
  {
    id: "proj-portfolio",
    title: "Personal portfolio site",
    description:
      "A responsive portfolio built with Next.js and deployed on Vercel.",
    skillIds: ["skill-react", "skill-css"],
    status: "completed",
    link: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "proj-taskapp",
    title: "Kanban task manager",
    description: "Drag-and-drop board with local persistence.",
    skillIds: ["skill-react", "skill-ts"],
    status: "in-progress",
    link: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "proj-api",
    title: "Dockerized REST API",
    description: "Small Express API packaged for deployment.",
    skillIds: ["skill-docker"],
    status: "planned",
    link: "",
    createdAt: new Date().toISOString(),
  },
];

const seedApplications: Application[] = [
  {
    id: "app-1",
    company: "Nimbus Cloud",
    role: "Frontend Developer Intern",
    status: "interviewing",
    appliedDate: daysFromNow(-10),
    link: "",
    notes: "Second round scheduled.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "app-2",
    company: "Fieldwork Labs",
    role: "Junior React Developer",
    status: "applied",
    appliedDate: daysFromNow(-3),
    link: "",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "app-3",
    company: "Northwind Studio",
    role: "Frontend Engineer",
    status: "wishlist",
    appliedDate: "",
    link: "",
    notes: "Great design team, apply after portfolio update.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "app-4",
    company: "Basecamp Retail",
    role: "Web Developer",
    status: "rejected",
    appliedDate: daysFromNow(-20),
    link: "",
    notes: "Asked for more backend experience.",
    createdAt: new Date().toISOString(),
  },
];

const seedInterviews: Interview[] = [
  {
    id: "int-1",
    company: "Nimbus Cloud",
    type: "technical",
    status: "upcoming",
    date: daysFromNow(3),
    notes: "Review React performance and array algorithms.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "int-2",
    company: "Fieldwork Labs",
    type: "behavioral",
    status: "upcoming",
    date: daysFromNow(6),
    notes: "Prepare STAR stories for teamwork and conflict.",
    createdAt: new Date().toISOString(),
  },
];

const seedGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Land a frontend internship",
    description: "Apply to at least 15 companies this quarter.",
    targetDate: daysFromNow(45),
    status: "active",
    progress: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: "goal-2",
    title: "Finish the TypeScript deep dive",
    description: "Complete all roadmap milestones for TypeScript.",
    targetDate: daysFromNow(20),
    status: "active",
    progress: 50,
    createdAt: new Date().toISOString(),
  },
];

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
      skills: seedSkills,
      projects: seedProjects,
      applications: seedApplications,
      interviews: seedInterviews,
      goals: seedGoals,
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
