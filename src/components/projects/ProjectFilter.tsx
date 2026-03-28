"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterOptions } from "@/types";
import { useProjectFilter } from "@/hooks/useProjectFilter";
import { X } from "lucide-react";

interface ProjectFilterProps {
  filterOptions: FilterOptions;
}

export function ProjectFilter({ filterOptions }: ProjectFilterProps) {
  const { usage, structureType, status, setFilter, clearFilters } =
    useProjectFilter();

  const hasFilters = usage || structureType || status;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="min-w-[180px]">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          용도
        </label>
        <Select value={usage} onValueChange={(v) => setFilter("usage", v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.usages.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          구조형식
        </label>
        <Select
          value={structureType}
          onValueChange={(v) => setFilter("structureType", v ?? "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.structureTypes.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[160px]">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          진행단계
        </label>
        <Select value={status} onValueChange={(v) => setFilter("status", v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <X className="mr-1 h-4 w-4" />
          초기화
        </Button>
      )}
    </div>
  );
}
