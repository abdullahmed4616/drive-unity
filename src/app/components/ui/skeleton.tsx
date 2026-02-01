import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse rounded-lg bg-[rgba(100,120,200,0.1)]",
        className
      )}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
