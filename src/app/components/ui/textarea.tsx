import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-[rgba(100,120,200,0.25)] bg-[rgba(13,13,43,0.6)] px-3 py-2 text-sm text-[#e0e0f0] placeholder:text-[rgba(224,224,240,0.35)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(100,120,200,0.4)] focus-visible:border-[rgba(100,120,200,0.5)] disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
