"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema, type SkillFormValues } from "@/schemas/schema";
import {
  SKILL_CATEGORIES,
  SKILL_STATUS_LABELS,
  type Skill,
} from "@/types/types";
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
import { FiSave } from "react-icons/fi";
import { IoRocketOutline } from "react-icons/io5";

interface SkillModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SkillFormValues) => void;
  onDelete?: () => void;
  initialSkill?: Skill | null;
}

export default function SkillModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  initialSkill,
}: SkillModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "Frontend",
      status: "not-started",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initialSkill) {
      reset({
        name: initialSkill.name,
        category: initialSkill.category,
        status: initialSkill.status,
        notes: initialSkill.notes,
      });
    } else {
      reset({
        name: "",
        category: "Frontend",
        status: "not-started",
        notes: "",
      });
    }
  }, [open, initialSkill, reset]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className={`text-center font-bold text-xl`}>
            {initialSkill ? "Edit skill" : "Add a skill"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 pb-5">
          <div>
            <Label htmlFor="name" className="mb-1.5">
              Skill name
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="e.g. GraphQL"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="mb-1.5">
                Category
              </Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
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
                      {Object.entries(SKILL_STATUS_LABELS).map(
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
          </div>

          <div>
            <Label htmlFor="notes" className="mb-1.5">
              Notes <span className="normal-case text-faint">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              rows={3}
              {...register("notes")}
              placeholder="What are you focusing on right now?"
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-destructive">
                {errors.notes.message}
              </p>
            )}
          </div>

          <DialogFooter className="border-0 px-2 bg-transparent pt-2">
            {initialSkill && onDelete ? (
              <button type="button" onClick={onDelete} className="deleteBtn">
                Delete skill
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {initialSkill ? <FiSave /> : <IoRocketOutline />}
                {initialSkill ? "Save changes" : "Add skill"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
