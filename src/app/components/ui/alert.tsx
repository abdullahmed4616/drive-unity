import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
  {
    variants: {
      variant: {
        default:
          "border-[rgba(100,120,200,0.2)] bg-[rgba(13,13,43,0.5)] text-[#e0e0f0] [&>svg]:text-[#6b8fd4]",
        destructive:
          "border-[rgba(180,40,80,0.3)] bg-[rgba(74,26,46,0.3)] text-[#ff8fa3] [&>svg]:text-[#ff6b85]",
        success:
          "border-[rgba(40,180,80,0.3)] bg-[rgba(26,74,46,0.3)] text-[#6bffa0] [&>svg]:text-[#6bffa0]",
        warning:
          "border-[rgba(200,160,40,0.3)] bg-[rgba(74,60,26,0.3)] text-[#ffd666] [&>svg]:text-[#ffd666]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-80 [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
