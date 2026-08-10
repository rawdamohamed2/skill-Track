"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Flag, ArrowUpRight } from "lucide-react";
import { useSkillTrackStore } from "@/stores/store";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  CATEGORY_ACCENT,
} from "@/types/types";
import StatCard from "@/components/dashboard/StatCard";
import GoalModal from "@/components/goals/GoalModal";
import type { GoalFormValues } from "@/schemas/schema";
import { daysUntil, formatDate, skillProgress } from "@/lib/utils";
import BarRow from "@/components/BarRow";

const APPLICATION_STATUS_STYLE: Record<ApplicationStatus, string> = {
  wishlist: "bg-muted text-muted-foreground",
  applied: "bg-secondary/20 text-secondary",
  interviewing: "bg-chart-4/20 text-chart-4",
  offer: "bg-primary/20 text-primary",
  rejected: "bg-destructive/20 text-destructive",
};

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function DashboardPage() {
  const { skills, applications, interviews, goals, hasHydrated, addGoal } =
    useSkillTrackStore();

  const [greeting, setGreeting] = useState("Hello");
  const [search, setSearch] = useState("");
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12
        ? "Good morning"
        : hour < 18
          ? "Good afternoon"
          : "Good evening",
    );
  }, []);

  const avgSkillProgress = skills.length
    ? Math.round(
        skills.reduce((sum, s) => sum + skillProgress(s), 0) / skills.length,
      )
    : 0;

  const activeApplications = applications.filter(
    (a) => a.status === "applied" || a.status === "interviewing",
  ).length;

  const activeGoals = goals.filter((g) => g.status === "active");

  const topSkills = useMemo(
    () =>
      [...skills]
        .sort((a, b) => skillProgress(b) - skillProgress(a))
        .slice(0, 4),
    [skills],
  );
  const upcomingInterviews = interviews
    .filter((i) => i.status === "upcoming" && i.date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const recentApplications = useMemo(
    () =>
      [...applications]
        .filter((a) => a.company.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 4),
    [applications, search],
  );

  const completedGoals = goals.filter((g) => g.status === "completed").length;

  const weeklyActivity = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
    return days.map((day) => {
      const iso = day.toISOString().slice(0, 10);
      const count =
        applications.filter((a) => a.appliedDate === iso).length +
        interviews.filter((i) => i.date === iso).length;
      return {
        label: day.toLocaleDateString("en-US", { weekday: "narrow" }),
        count,
      };
    });
  }, [applications, interviews]);
  const maxActivity = Math.max(1, ...weeklyActivity.map((d) => d.count));

  const handleAddGoal = (values: GoalFormValues) => {
    addGoal({
      title: values.title,
      description: values.description ?? "",
      targetDate: values.targetDate ?? "",
      status: values.status,
      progress: values.progress,
    });
    setGoalModalOpen(false);
  };

  if (!hasHydrated) return <div className="min-h-screen bg-background" />;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search paths, projects, or goals..."
          aria-label="Search paths, projects, or goals"
          className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl text-foreground">{greeting}.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s where things stand today.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setGoalModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-accent"
          >
            <Flag className="size-4" />
            Add Goal
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Total Progress"
          value={`${avgSkillProgress}%`}
          accent="primary"
          hint="across all skills"
        />
        <StatCard
          label="Active Goals"
          value={String(activeGoals.length)}
          accent="tertiary"
          hint="on track"
        />
        <StatCard
          label="Pipeline"
          value={String(activeApplications)}
          accent="secondary"
          hint="active applications"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-primary">
              Skill progress
            </h2>
            <Link
              href="/skills"
              className="text-xs text-muted hover:text-primary"
            >
              View all →
            </Link>
          </div>
          {topSkills.length === 0 ? (
            <p className="text-sm text-muted">No skills logged yet.</p>
          ) : (
            <div className="space-y-4">
              {topSkills.map((s) => (
                <BarRow
                  key={s.id}
                  label={s.name}
                  percent={skillProgress(s)}
                  accent={CATEGORY_ACCENT[s.category]}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-line bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-primary">
              Upcoming interviews
            </h2>
            <Link
              href="/interviews"
              className="text-xs text-muted hover:text-primary"
            >
              View all →
            </Link>
          </div>
          {upcomingInterviews.length === 0 ? (
            <p className="text-sm text-muted">Nothing on the calendar.</p>
          ) : (
            <div className="space-y-3">
              {upcomingInterviews.map((i) => {
                const until = daysUntil(i.date);
                return (
                  <div
                    key={i.id}
                    className="flex items-center justify-between border-b border-line-soft pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm text-primary">{i.company}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {i.type.replace("-", " ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-muted-foreground">
                        {formatDate(i.date)}
                      </p>
                      <p className="font-mono text-[11px] text-primary">
                        {until <= 0 ? "today" : `in ${until}d`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-primary">Goals</h2>
            <Link
              href="/goals"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              View all →
            </Link>
          </div>
          <p className="mb-4 text-xs text--foreground ">
            {activeGoals.length} active · {completedGoals} completed
          </p>
          {activeGoals.length === 0 ? (
            <p className="text-sm text--foreground ">No active goals.</p>
          ) : (
            <div className="space-y-4">
              {activeGoals.slice(0, 4).map((g) => (
                <BarRow
                  key={g.id}
                  label={g.title}
                  percent={g.progress}
                  accent="var(--primary-container)"
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground">
              Job Tracker
            </h2>
            <Link
              href="/applications"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((a) => {
                const until =
                  a.status === "interviewing" ? undefined : undefined;
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm text-foreground">{a.company}</p>
                      <p className="text-xs text-muted-foreground">{a.role}</p>
                    </div>
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium uppercase ${APPLICATION_STATUS_STYLE[a.status]}`}
                    >
                      {APPLICATION_STATUS_LABELS[a.status]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <GoalModal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSubmit={handleAddGoal}
      />
    </main>
  );
}
