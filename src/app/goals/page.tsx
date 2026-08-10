"use client";

import { useMemo, useState } from "react";
import { useSkillTrackStore } from "@/stores/store";
import type { Goal, GoalStatus } from "@/types/types";
import type { GoalFormValues } from "@/schemas/schema";
import PageHeader from "@/components/PageHeader";
import GoalCard from "@/components/goals/GoalCard";
import GoalModal from "@/components/goals/GoalModal";
import ConfirmDialog from "@/components/ConfirmDialog";

type SortKey = "recent" | "progress" | "date";
type FilterKey = "all" | GoalStatus;

export default function GoalsPage() {
  const { goals, hasHydrated, addGoal, updateGoal, deleteGoal } =
    useSkillTrackStore();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = goals;
    if (filter !== "all") list = list.filter((g) => g.status === filter);
    if (q) list = list.filter((g) => g.title.toLowerCase().includes(q));
    const sorted = [...list];
    if (sort === "progress") sorted.sort((a, b) => b.progress - a.progress);
    else if (sort === "date")
      sorted.sort((a, b) =>
        (a.targetDate || "9999").localeCompare(b.targetDate || "9999"),
      );
    else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [goals, search, sort, filter]);

  const handleSubmit = (values: GoalFormValues) => {
    const data = {
      title: values.title,
      description: values.description ?? "",
      targetDate: values.targetDate ?? "",
      status: values.status,
      progress: values.progress,
    };
    if (editing) updateGoal(editing.id, data);
    else addGoal(data);
    setModalOpen(false);
    setEditing(null);
  };

  const deletingGoal = goals.find((g) => g.id === deletingId);

  if (!hasHydrated) return <div className="min-h-dvh bg-void" />;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="North star"
        title="Goals"
        description="The bigger targets your skills, projects, and applications are building toward."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search goals"
        sortOptions={[
          { value: "recent", label: "Recent" },
          { value: "progress", label: "Progress" },
          { value: "date", label: "Target date" },
        ]}
        sortValue={sort}
        onSortChange={(v) => setSort(v as SortKey)}
        actionLabel="Create goal"
        onAction={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "active", "completed"] as FilterKey[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs capitalize transition ${
              filter === f
                ? "border-xp text-primary"
                : "border-line text-muted hover:text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-lg text-primary">
            {goals.length ? "No goals match" : "No goals yet"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {goals.length
              ? "Try a different filter."
              : "Set the first thing you're working toward."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => {
                setEditing(goal);
                setModalOpen(true);
              }}
              onDelete={() => setDeletingId(goal.id)}
            />
          ))}
        </div>
      )}

      <GoalModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        onDelete={
          editing
            ? () => {
                setDeletingId(editing.id);
                setModalOpen(false);
              }
            : undefined
        }
        initialGoal={editing}
      />

      <ConfirmDialog
        open={!!deletingId}
        title="Delete this goal?"
        body={`"${deletingGoal?.title}" will be removed for good.`}
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteGoal(deletingId);
          setDeletingId(null);
        }}
      />
    </main>
  );
}
