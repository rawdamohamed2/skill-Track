"use client";

import { useMemo, useState } from "react";
import { useSkillTrackStore } from "@/stores/store";
import type { Interview, InterviewStatus } from "@/types/types";
import type { InterviewFormValues } from "@/schemas/schema";
import PageHeader from "@/components/PageHeader";
import InterviewCard from "@/components/interviews/InterviewCard";
import InterviewModal from "@/components/interviews/InterviewModal";
import ConfirmDialog from "@/components/ConfirmDialog";

type FilterKey = "all" | InterviewStatus;

export default function InterviewsPage() {
  const {
    interviews,
    hasHydrated,
    addInterview,
    updateInterview,
    deleteInterview,
  } = useSkillTrackStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = interviews;
    if (filter !== "all") list = list.filter((i) => i.status === filter);
    if (q) list = list.filter((i) => i.company.toLowerCase().includes(q));
    return [...list].sort((a, b) =>
      (a.date || "9999").localeCompare(b.date || "9999"),
    );
  }, [interviews, search, filter]);

  const handleSubmit = (values: InterviewFormValues) => {
    const data = {
      company: values.company,
      type: values.type,
      status: values.status,
      date: values.date ?? "",
      notes: values.notes ?? "",
    };
    if (editing) updateInterview(editing.id, data);
    else addInterview(data);
    setModalOpen(false);
    setEditing(null);
  };

  const deletingInterview = interviews.find((i) => i.id === deletingId);

  if (!hasHydrated) return <div className="min-h-screen bg-void" />;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="Prep room"
        title="Interviews"
        description="Every interview and the notes you're preparing for it."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by company"
        actionLabel="Add interview"
        onAction={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "upcoming", "completed"] as FilterKey[]).map((f) => (
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
            {interviews.length ? "No interviews match" : "No interviews yet"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {interviews.length
              ? "Try a different filter."
              : "Add one once you land an interview."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onEdit={() => {
                setEditing(interview);
                setModalOpen(true);
              }}
              onDelete={() => setDeletingId(interview.id)}
            />
          ))}
        </div>
      )}

      <InterviewModal
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
        initialInterview={editing}
      />

      <ConfirmDialog
        open={!!deletingId}
        title="Delete this interview?"
        body={`The ${deletingInterview?.company} entry will be removed for good.`}
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteInterview(deletingId);
          setDeletingId(null);
        }}
      />
    </main>
  );
}
