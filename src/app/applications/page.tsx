"use client";

import { useMemo, useState } from "react";
import { useSkillTrackStore } from "@/stores/store";
import type { Application, ApplicationStatus } from "@/types/types";
import type { ApplicationFormValues } from "@/schemas/schema";
import PageHeader from "@/components/PageHeader";
import ApplicationBoard from "@/components/applications/ApplicationBoard";
import ApplicationModal from "@/components/applications/ApplicationModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ApplicationsPage() {
  const {
    applications,
    hasHydrated,
    addApplication,
    updateApplication,
    deleteApplication,
    moveApplication,
  } = useSkillTrackStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [defaultStatus, setDefaultStatus] =
    useState<ApplicationStatus>("wishlist");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(
      (a) =>
        a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q),
    );
  }, [applications, search]);

  const handleSubmit = (values: ApplicationFormValues) => {
    const data = {
      company: values.company,
      role: values.role,
      status: values.status,
      appliedDate: values.appliedDate ?? "",
      link: values.link ?? "",
      notes: values.notes ?? "",
    };
    if (editing) updateApplication(editing.id, data);
    else addApplication(data);
    setModalOpen(false);
    setEditing(null);
  };

  const deletingApp = applications.find((a) => a.id === deletingId);

  if (!hasHydrated) return <div className="min-h-screen bg-void" />;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="Pipeline"
        title="Applications"
        description="Every application, dragged along its own path from wishlist to offer."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search applications"
        actionLabel="Log application"
        onAction={() => {
          setEditing(null);
          setDefaultStatus("wishlist");
          setModalOpen(true);
        }}
      />

      {applications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-lg text-primary">
            No applications yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Log the first role you&apos;re interested in.
          </p>
        </div>
      ) : (
        <ApplicationBoard
          applications={filtered}
          onOpen={(app) => {
            setEditing(app);
            setModalOpen(true);
          }}
          onAdd={(status) => {
            setEditing(null);
            setDefaultStatus(status);
            setModalOpen(true);
          }}
          onMove={moveApplication}
        />
      )}

      <ApplicationModal
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
        initialApplication={editing}
        defaultStatus={defaultStatus}
      />

      <ConfirmDialog
        open={!!deletingId}
        title="Delete this application?"
        body={`"${deletingApp?.company} — ${deletingApp?.role}" will be removed for good.`}
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteApplication(deletingId);
          setDeletingId(null);
        }}
      />
    </main>
  );
}
