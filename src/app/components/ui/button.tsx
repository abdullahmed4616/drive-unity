import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a1a] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#1a3a6a] text-white hover:bg-[#244d8a] focus-visible:ring-[#1a3a6a] shadow-md shadow-[#1a3a6a]/20",
        destructive:
          "bg-[#4a1a2e] text-white hover:bg-[#5e2239] focus-visible:ring-[#4a1a2e] shadow-md shadow-[#4a1a2e]/20",
        outline:
          "border border-[rgba(100,120,200,0.3)] bg-transparent text-[#e0e0f0] hover:bg-[rgba(100,120,200,0.1)] hover:border-[rgba(100,120,200,0.5)] focus-visible:ring-[rgba(100,120,200,0.5)]",
        secondary:
          "bg-[#0d0d2b] text-[#e0e0f0] border border-[rgba(100,120,200,0.2)] hover:bg-[rgba(100,120,200,0.1)] focus-visible:ring-[rgba(100,120,200,0.3)]",
        ghost:
          "text-[#e0e0f0] hover:bg-[rgba(100,120,200,0.1)] focus-visible:ring-[rgba(100,120,200,0.3)]",
        link: "text-[#6b8fd4] underline-offset-4 hover:underline focus-visible:ring-[#6b8fd4]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
