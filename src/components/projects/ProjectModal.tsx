"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormValues } from "@/schemas/schema";
import { PROJECT_STATUS_LABELS, type Project, type Skill } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FiSave } from "react-icons/fi";
import { IoRocketOutline } from "react-icons/io5";

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void;
  initialProject?: Project | null;
  skills: Skill[];
}

export default function ProjectModal({
  open,
  onClose,
  onSubmit,
  initialProject,
  skills,
}: ProjectModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "planned",
      skillIds: [],
      link: "",
    },
  });

  const skillIds = watch("skillIds") ?? [];

  useEffect(() => {
    if (!open) return;
    if (initialProject) {
      reset({
        title: initialProject.title,
        description: initialProject.description,
        status: initialProject.status,
        skillIds: initialProject.skillIds,
        link: initialProject.link,
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "planned",
        skillIds: [],
        link: "",
      });
    }
  }, [open, initialProject, reset]);

  const toggleSkill = (id: string) => {
    const next = skillIds.includes(id)
      ? skillIds.filter((s) => s !== id)
      : [...skillIds, id];
    setValue("skillIds", next);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="min-w-lg">
        <DialogHeader>
          <DialogTitle className={`text-center font-bold text-xl`}>
            {initialProject ? "Edit project" : "Add a project"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-6 pb-5 pt-2"
        >
          <div>
            <Label htmlFor="title" className="mb-1.5">
              Project title
            </Label>
            <Input
              id="title"
              type="text"
              {...register("title")}
              placeholder="e.g. Weather dashboard"
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="mb-1.5">
              Description{" "}
              <span className="normal-case text-faint">(optional)</span>
            </Label>
            <Textarea
              id="description"
              rows={3}
              {...register("description")}
              placeholder="What does this project do?"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3  gap-4">
            <div>
              <Label htmlFor="status" className="mb-1.5">
                Status
              </Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROJECT_STATUS_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className={`col-span-2`}>
              <Label htmlFor="link" className="mb-1.5">
                Link{" "}
                <span className="normal-case text-sidebar-accent-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="link"
                type="text"
                {...register("link")}
                placeholder="https://"
              />
              {errors.link && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.link.message}
                </p>
              )}
            </div>
          </div>

          {skills.length > 0 && (
            <div className={``}>
              <Label className="mb-1.5">Skills used</Label>
              <div className="flex flex-wrap gap-2 ">
                {skills.map((s) => {
                  const active = skillIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSkill(s.id)}
                      aria-pressed={active}
                      className={cn(
                        badgeVariants({
                          variant: active ? "default" : "outline",
                        }),
                        "cursor-pointer p-2 rounded-lg border border-primary hover:bg-primary/20",
                      )}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter className="border-0 px-2 bg-transparent pt-2">
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {initialProject ? <FiSave /> : <IoRocketOutline />}
                {initialProject ? "Save changes" : "Add project"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
