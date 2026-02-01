"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({
  activeTab: "",
  setActiveTab: () => {},
});

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div ref={ref} className={cn("", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center gap-1 rounded-lg bg-[rgba(13,13,43,0.6)] border border-[rgba(100,120,200,0.15)] p-1",
        className
      )}
      role="tablist"
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext);
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all cursor-pointer",
          isActive
            ? "bg-[#1a3a6a] text-white shadow-sm shadow-[#1a3a6a]/30"
            : "text-[rgba(224,224,240,0.5)] hover:text-[#e0e0f0] hover:bg-[rgba(100,120,200,0.08)]",
          className
        )}
        onClick={() => setActiveTab(value)}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { activeTab } = React.useContext(TabsContext);

    if (activeTab !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn("mt-2", className)}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
