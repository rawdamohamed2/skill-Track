"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSkillTrackStore } from "@/stores/store";
import { CATEGORY_ACCENT, SKILL_STATUS_LABELS } from "@/types/types";
import type { SkillFormValues } from "@/schemas/schema";
import LevelRing from "@/components/skills/LevelRing";
import MilestoneList from "@/components/skills/MilestoneList";
import SkillModal from "@/components/skills/SkillModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { skillProgress } from "@/lib/utils";

export default function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    skills,
    hasHydrated,
    updateSkill,
    deleteSkill,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
  } = useSkillTrackStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const skill = skills.find((s) => s.id === id);

  if (!hasHydrated) return <div className="min-h-screen bg-void" />;

  if (!skill) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="font-display text-xl text-primary">
          This skill doesn&apos;t exist
        </p>
        <p className="mt-2 text-sm text-muted">It may have been deleted.</p>
        <Link
          href="/skills"
          className="mt-5 inline-block rounded-md bg-xp px-4 py-2 text-sm font-medium text-void"
        >
          Back to skills
        </Link>
      </main>
    );
  }

  const accent = CATEGORY_ACCENT[skill.category];
  const percent = skillProgress(skill);

  const handleSubmit = (values: SkillFormValues) => {
    updateSkill(skill.id, {
      name: values.name,
      category: values.category,
      status: values.status,
      notes: values.notes ?? "",
    });
    setModalOpen(false);
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <nav className="mb-6 text-sm text-faint">
        <Link href="/skills" className="hover:text-primary">
          Skills
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted">{skill.name}</span>
      </nav>

      <div className="mb-8 flex items-start justify-between gap-4 rounded-lg border border-line bg-panel p-6">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-faint">
            {skill.category}
          </p>

          <h1 className="font-display text-2xl text-primary">{skill.name}</h1>

          <p className="mt-1 font-mono text-sm text-chart-5">
            {SKILL_STATUS_LABELS[skill.status]}
          </p>

          {skill.notes && (
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              {skill.notes}
            </p>
          )}

          <div className="mt-4 flex gap-4 text-sm">
            <button onClick={() => setModalOpen(true)} className="editBtn">
              Edit
            </button>
            <button onClick={() => setDeleteOpen(true)} className="deleteBtn">
              Delete
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <LevelRing percent={percent} accent={accent} size={80} />
          <span className="font-mono text-[11px] text-faint">
            {Math.round(percent)}% reached
          </span>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg text-primary">Roadmap</h2>
        <MilestoneList
          milestones={skill.milestones}
          accent={accent}
          onToggle={(mid) => toggleMilestone(skill.id, mid)}
          onDelete={(mid) => deleteMilestone(skill.id, mid)}
          onAdd={(title) => addMilestone(skill.id, title)}
        />
      </section>

      <SkillModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={() => {
          setModalOpen(false);
          setDeleteOpen(true);
        }}
        initialSkill={skill}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this skill?"
        body={`"${skill.name}" and its roadmap will be removed for good.`}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteSkill(skill.id);
          setDeleteOpen(false);
        }}
      />
    </main>
  );
}
