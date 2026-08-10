"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalSchema, type GoalFormValues } from "@/schemas/schema";
import type { Goal } from "@/types/types";
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
import { IoRocketOutline } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: GoalFormValues) => void;
  onDelete?: () => void;
  initialGoal?: Goal | null;
}

export default function GoalModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  initialGoal,
}: GoalModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      targetDate: "",
      status: "active",
      progress: 0,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initialGoal) {
      reset({
        title: initialGoal.title,
        description: initialGoal.description,
        targetDate: initialGoal.targetDate,
        status: initialGoal.status,
        progress: initialGoal.progress,
      });
    } else {
      reset({
        title: "",
        description: "",
        targetDate: "",
        status: "active",
        progress: 0,
      });
    }
  }, [open, initialGoal, reset]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="min-w-lg ">
        <DialogHeader>
          <DialogTitle className={`text-center font-bold text-xl`}>
            {initialGoal ? "Edit goal" : "Set a goal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 pb-5">
          <div>
            <Label htmlFor="title" className="mb-1.5">
              Goal
            </Label>
            <Input
              id="title"
              type="text"
              {...register("title")}
              placeholder="e.g. Land a frontend internship"
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
              rows={2}
              {...register("description")}
              placeholder="What does success look like?"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <div className={`col-span-2`}>
              <Label htmlFor="targetDate" className="mb-1.5">
                Target date{" "}
                <span className="normal-case text-faint">(optional)</span>
              </Label>
              <Input id="targetDate" type="date" {...register("targetDate")} />
              {errors.targetDate && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.targetDate.message}
                </p>
              )}
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="progress" className="mb-1.5">
                Progress %
              </Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                {...register("progress", { valueAsNumber: true })}
              />
              {errors.progress && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.progress.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="border-0 bg-transparent p-2 ">
            {initialGoal && onDelete ? (
              <button type="button" onClick={onDelete} className="deleteBtn">
                Delete goal
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {initialGoal ? <FiSave /> : <IoRocketOutline />}
                {initialGoal ? " Save changes" : " Create Goal"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
