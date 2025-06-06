// components/blog/CategoryBadge.tsx

import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

type CustomBadgeProps = {
  label: string;
  active?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

export function CustomBadge({
  label,
  active = false,
  loading = false,
  onClick,
}: CustomBadgeProps) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      onClick={onClick}
      aria-busy={loading}
      className={cn(
        "cursor-pointer capitalize flex items-center gap-1 transition-opacity",
        loading && "opacity-70 pointer-events-none"
      )}
    >
      {label}
      {loading && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
    </Badge>
  );
}
