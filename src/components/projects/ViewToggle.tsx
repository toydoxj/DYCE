"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, Table2 } from "lucide-react";

interface ViewToggleProps {
  view: "gallery" | "table";
  onViewChange: (view: "gallery" | "table") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg border p-1">
      <Button
        variant={view === "gallery" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("gallery")}
        className={view === "gallery" ? "bg-navy text-white" : ""}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className={view === "table" ? "bg-navy text-white" : ""}
      >
        <Table2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
