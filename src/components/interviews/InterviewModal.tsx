"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { interviewSchema, type InterviewFormValues } from "@/schemas/schema";
import { INTERVIEW_TYPE_LABELS, type Interview } from "@/types/types";
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

interface InterviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: InterviewFormValues) => void;
  onDelete?: () => void;
  initialInterview?: Interview | null;
}

export default function InterviewModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  initialInterview,
}: InterviewModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      company: "",
      type: "technical",
      status: "upcoming",
      date: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initialInterview) {
      reset({
        company: initialInterview.company,
        type: initialInterview.type,
        status: initialInterview.status,
        date: initialInterview.date,
        notes: initialInterview.notes,
      });
    } else {
      reset({
        company: "",
        type: "technical",
        status: "upcoming",
        date: "",
        notes: "",
      });
    }
  }, [open, initialInterview, reset]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="min-w-lg">
        <DialogHeader>
          <DialogTitle className={`text-center font-bold text-xl`}>
            {initialInterview ? "Edit interview" : "Add an interview"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-6 pb-5 pt-2"
        >
          <div>
            <Label htmlFor="company" className="mb-1.5">
              Company
            </Label>
            <Input
              id="company"
              type="text"
              {...register("company")}
              placeholder="e.g. Nimbus Cloud"
              aria-invalid={!!errors.company}
            />
            {errors.company && (
              <p className="mt-1 text-xs text-destructive">
                {errors.company.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type" className="mb-1.5">
                Type
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(INTERVIEW_TYPE_LABELS).map(
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
            <div>
              <Label htmlFor="date" className="mb-1.5">
                Date <span className="normal-case text-faint">(optional)</span>
              </Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.date.message}
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
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="mb-1.5">
              Prep notes{" "}
              <span className="normal-case text-faint">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              rows={3}
              {...register("notes")}
              placeholder="Topics to review, questions to ask..."
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-destructive">
                {errors.notes.message}
              </p>
            )}
          </div>

          <DialogFooter className="border-0 bg-transparent px-2 pt-2">
            {initialInterview && onDelete ? (
              <button type="button" onClick={onDelete} className="deleteBtn">
                Delete interview
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {initialInterview ? <FiSave /> : <IoRocketOutline />}
                {initialInterview ? "Save changes" : "Add interview"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
