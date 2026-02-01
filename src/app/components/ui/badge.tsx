import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1a3a6a] text-white shadow-sm shadow-[#1a3a6a]/20",
        secondary:
          "border-[rgba(100,120,200,0.2)] bg-[rgba(13,13,43,0.6)] text-[#e0e0f0]",
        destructive:
          "border-transparent bg-[#4a1a2e] text-white shadow-sm shadow-[#4a1a2e]/20",
        outline:
          "border-[rgba(100,120,200,0.3)] text-[#e0e0f0]",
        success:
          "border-transparent bg-[#1a4a2e] text-[#6bffa0] shadow-sm shadow-[#1a4a2e]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
