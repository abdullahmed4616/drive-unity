"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: [],
  toggle: () => {},
  type: "single",
});

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string[];
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", defaultValue = [], children, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

    const toggle = React.useCallback(
      (value: string) => {
        setOpenItems((prev) => {
          if (type === "single") {
            return prev.includes(value) ? [] : [value];
          }
          return prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value];
        });
      },
      [type]
    );

    return (
      <AccordionContext.Provider value={{ openItems, toggle, type }}>
        <div ref={ref} className={cn("space-y-1", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-value={value}
        className={cn(
          "border border-[rgba(100,120,200,0.15)] rounded-lg overflow-hidden",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<{ value?: string }>, { value })
            : child
        )}
      </div>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, value, ...props }, ref) => {
    const { openItems, toggle } = React.useContext(AccordionContext);
    const isOpen = value ? openItems.includes(value) : false;

    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center justify-between py-4 px-4 text-sm font-medium text-[#e0e0f0] transition-all hover:bg-[rgba(100,120,200,0.08)] cursor-pointer",
          className
        )}
        onClick={() => value && toggle(value)}
        aria-expanded={isOpen}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[rgba(100,120,200,0.6)] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, value, ...props }, ref) => {
    const { openItems } = React.useContext(AccordionContext);
    const isOpen = value ? openItems.includes(value) : false;

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "px-4 pb-4 text-sm text-[rgba(224,224,240,0.7)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
