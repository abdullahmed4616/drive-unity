"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onCheckedChange, onChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
    const isChecked = checked ?? internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalChecked(e.target.checked);
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    };

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded-[4px] border border-[rgba(100,120,200,0.35)] transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(100,120,200,0.4)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0a0a1a] peer-disabled:cursor-not-allowed peer-disabled:opacity-50 flex items-center justify-center",
            isChecked
              ? "bg-[#1a3a6a] border-[#1a3a6a]"
              : "bg-transparent",
            className
          )}
        >
          {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </div>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
