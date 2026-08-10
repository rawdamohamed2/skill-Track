"use client";

import { useMemo, useState } from "react";
import { useSkillTrackStore } from "@/stores/store";
import type { Skill } from "@/types/types";
import type { SkillFormValues } from "@/schemas/schema";
import PageHeader from "@/components/PageHeader";
import SkillCard from "@/components/skills/SkillCard";
import SkillModal from "@/components/skills/SkillModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { skillProgress } from "@/lib/utils";

type SortKey = "recent" | "name" | "progress";

export default function SkillsPage() {
  const { skills, hasHydrated, addSkill, updateSkill, deleteSkill } =
    useSkillTrackStore();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = skills;
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "progress")
      sorted.sort((a, b) => skillProgress(b) - skillProgress(a));
    else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [skills, search, sort]);

  const handleSubmit = (values: SkillFormValues) => {
    if (editing) {
      updateSkill(editing.id, {
        name: values.name,
        category: values.category,
        status: values.status,
        notes: values.notes ?? "",
      });
    } else {
      addSkill({
        name: values.name,
        category: values.category,
        status: values.status,
        notes: values.notes ?? "",
      });
    }
    setModalOpen(false);
    setEditing(null);
  };

  const deletingSkill = skills.find((s) => s.id === deletingId);

  if (!hasHydrated) return <div className="min-h-screen bg-void" />;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="Skill tree"
        title="Skills"
        description="Every skill you're building, with a roadmap and level of its own."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search skills"
        sortOptions={[
          { value: "recent", label: "Recent" },
          { value: "name", label: "Name" },
          { value: "progress", label: "Progress" },
        ]}
        sortValue={sort}
        onSortChange={(v) => setSort(v as SortKey)}
        actionLabel="Add skill"
        onAction={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-lg text-primary">
            {skills.length ? "No skills match that search" : "No skills yet"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {skills.length
              ? "Try a different name or category."
              : "Add the first skill you're skills."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={() => {
                setEditing(skill);
                setModalOpen(true);
              }}
              onDelete={() => setDeletingId(skill.id)}
            />
          ))}
        </div>
      )}

      <SkillModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initialSkill={editing}
      />

      <ConfirmDialog
        open={!!deletingId}
        title="Delete this skill?"
        body={`"${deletingSkill?.name}" and its roadmap will be removed for good.`}
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteSkill(deletingId);
          setDeletingId(null);
        }}
      />
    </main>
  );
}
