"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { IoRocketOutline } from "react-icons/io5";

interface SortOption {
  value: string;
  label: string;
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder: string;
  sortOptions?: SortOption[];
  sortValue?: string;
  onSortChange?: (v: string) => void;
  actionLabel: string;
  onAction: () => void;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  search,
  onSearchChange,
  searchPlaceholder,
  sortOptions,
  sortValue,
  onSortChange,
  actionLabel,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-faint">
            {eyebrow}
          </p>
          <h1 className="font-display text-3xl text-foreground">{title}</h1>
          {description && (
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <Button onClick={onAction} className="self-start whitespace-nowrap">
          <IoRocketOutline />
          {actionLabel}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" />
          <Input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-52 pl-8 sm:w-64"
          />
        </div>
        {sortOptions && onSortChange && (
          <Select
            value={sortValue}
            onValueChange={(value) => {
              if (value !== null) {
                onSortChange(value);
              }
            }}
          >
            <SelectTrigger aria-label="Sort" className="w-auto min-w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  Sort: {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
