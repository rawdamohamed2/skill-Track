"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicationSchema,
  type ApplicationFormValues,
} from "@/schemas/schema";
import {
  APPLICATION_STATUS_LABELS,
  type Application,
  type ApplicationStatus,
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

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ApplicationFormValues) => void;
  onDelete?: () => void;
  initialApplication?: Application | null;
  defaultStatus?: ApplicationStatus;
}

export default function ApplicationModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  initialApplication,
  defaultStatus = "wishlist",
}: ApplicationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: "",
      role: "",
      status: defaultStatus,
      appliedDate: "",
      link: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initialApplication) {
      reset({
        company: initialApplication.company,
        role: initialApplication.role,
        status: initialApplication.status,
        appliedDate: initialApplication.appliedDate,
        link: initialApplication.link,
        notes: initialApplication.notes,
      });
    } else {
      reset({
        company: "",
        role: "",
        status: defaultStatus,
        appliedDate: "",
        link: "",
        notes: "",
      });
    }
  }, [open, initialApplication, defaultStatus, reset]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="min-w-lg">
        <DialogHeader>
          <DialogTitle className={`text-center font-bold text-xl`}>
            {initialApplication ? "Edit application" : "Log an application"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-6 pb-5 pt-2"
        >
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="role" className="mb-1.5">
                Role
              </Label>
              <Input
                id="role"
                type="text"
                {...register("role")}
                placeholder="Frontend Developer Intern"
                aria-invalid={!!errors.role}
              />
              {errors.role && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                      {Object.entries(APPLICATION_STATUS_LABELS).map(
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
              <Label htmlFor="appliedDate" className="mb-1.5">
                Applied on{" "}
                <span className="normal-case text-faint">(optional)</span>
              </Label>
              <Input
                id="appliedDate"
                type="date"
                {...register("appliedDate")}
              />
              {errors.appliedDate && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.appliedDate.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="link" className="mb-1.5">
              Job link{" "}
              <span className="normal-case text-faint">(optional)</span>
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

          <div>
            <Label htmlFor="notes" className="mb-1.5">
              Notes <span className="normal-case text-faint">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              rows={3}
              {...register("notes")}
              placeholder="Contacts, next steps, referral..."
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-destructive">
                {errors.notes.message}
              </p>
            )}
          </div>

          <DialogFooter className="border-0 bg-transparent px-2 pt-2">
            {initialApplication && onDelete ? (
              <button type="button" onClick={onDelete} className="deleteBtn">
                Delete application
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {initialApplication ? <FiSave /> : <IoRocketOutline />}
                {initialApplication ? "Save changes" : "Log application"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
