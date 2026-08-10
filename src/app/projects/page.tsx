"use client";

import { useMemo, useState } from "react";
import { useSkillTrackStore } from "@/stores/store";
import {
  PROJECT_STATUS_LABELS,
  type Project,
  type ProjectStatus,
} from "@/types/types";
import type { ProjectFormValues } from "@/schemas/schema";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";
import ConfirmDialog from "@/components/ConfirmDialog";

type SortKey = "recent" | "title";
type FilterKey = "all" | ProjectStatus;

export default function ProjectsPage() {
  const {
    projects,
    skills,
    hasHydrated,
    addProject,
    updateProject,
    deleteProject,
  } = useSkillTrackStore();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = projects;
    if (filter !== "all") list = list.filter((p) => p.status === filter);
    if (q)
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    const sorted = [...list];
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [projects, search, sort, filter]);

  const handleSubmit = (values: ProjectFormValues) => {
    const data = {
      title: values.title,
      description: values.description ?? "",
      status: values.status,
      skillIds: values.skillIds ?? [],
      link: values.link ?? "",
    };
    if (editing) updateProject(editing.id, data);
    else addProject(data);
    setModalOpen(false);
    setEditing(null);
  };

  const deletingProject = projects.find((p) => p.id === deletingId);

  if (!hasHydrated) return <div className="min-h-screen bg-void" />;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="Build log"
        title="Projects"
        description="What you've built, what you're building, and what's queued up next."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search projects"
        sortOptions={[
          { value: "recent", label: "Recent" },
          { value: "title", label: "Title" },
        ]}
        sortValue={sort}
        onSortChange={(v) => setSort(v as SortKey)}
        actionLabel="Add project"
        onAction={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "planned", "in-progress", "completed"] as FilterKey[]).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                filter === f
                  ? "border-xp text-primary"
                  : "border-line text-muted hover:text-primary"
              }`}
            >
              {f === "all" ? "All" : PROJECT_STATUS_LABELS[f]}
            </button>
          ),
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-lg text-primary">
            {projects.length ? "No projects match" : "No projects yet"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {projects.length
              ? "Try a different search or filter."
              : "Log the first thing you're building."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              skills={skills}
              onEdit={() => {
                setEditing(project);
                setModalOpen(true);
              }}
              onDelete={() => setDeletingId(project.id)}
            />
          ))}
        </div>
      )}

      <ProjectModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initialProject={editing}
        skills={skills}
      />

      <ConfirmDialog
        open={!!deletingId}
        title="Delete this project?"
        body={`"${deletingProject?.title}" will be removed for good.`}
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteProject(deletingId);
          setDeletingId(null);
        }}
      />
    </main>
  );
}
