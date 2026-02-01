"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  value: "",
  onChange: () => {},
  open: false,
  setOpen: () => {},
});

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  children,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);

  const value = controlledValue ?? internalValue;
  const onChange = React.useCallback(
    (val: string) => {
      setInternalValue(val);
      onValueChange?.(val);
      setOpen(false);
    },
    [onValueChange]
  );

  return (
    <SelectContext.Provider value={{ value, onChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-[rgba(100,120,200,0.25)] bg-[rgba(13,13,43,0.6)] px-3 py-2 text-sm text-[#e0e0f0] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(100,120,200,0.4)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 text-[rgba(100,120,200,0.5)] transition-transform",
          open && "rotate-180"
        )}
      />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);
  return (
    <span className={cn(!value && "text-[rgba(224,224,240,0.35)]")}>
      {value || placeholder}
    </span>
  );
};

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-select-content]")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      data-select-content
      className={cn(
        "absolute z-50 mt-1 w-full rounded-lg border border-[rgba(100,120,200,0.2)] bg-[#0d0d2b] py-1 shadow-xl shadow-black/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value: itemValue, ...props }, ref) => {
    const { value, onChange } = React.useContext(SelectContext);
    const isSelected = value === itemValue;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-3 text-sm text-[#e0e0f0] transition-colors hover:bg-[rgba(100,120,200,0.1)]",
          isSelected && "bg-[rgba(26,58,106,0.3)]",
          className
        )}
        onClick={() => onChange(itemValue)}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {isSelected && <Check className="h-4 w-4 text-[#6b8fd4]" />}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
