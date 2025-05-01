"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

// Main tabs components (same as regular tabs)
function NestedTabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function NestedTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function NestedTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2.5 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NestedTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

// SubTab components
interface SubTabsContextType {
  activeMainTab: string;
  setActiveMainTab: (value: string) => void;
  activeSubTab: string;
  setActiveSubTab: (value: string) => void;
}

const SubTabsContext = React.createContext<SubTabsContextType | undefined>(undefined);

interface SubTabsProps {
  defaultMainTab?: string;
  defaultSubTab?: string;
  children: React.ReactNode;
  className?: string;
}

function SubTabs({ defaultMainTab = "", defaultSubTab = "", children, className }: SubTabsProps) {
  const [activeMainTab, setActiveMainTab] = React.useState(defaultMainTab);
  const [activeSubTab, setActiveSubTab] = React.useState(defaultSubTab);

  return (
    <SubTabsContext.Provider value={{ activeMainTab, setActiveMainTab, activeSubTab, setActiveSubTab }}>
      <div className={cn("flex flex-col gap-4", className)}>
        {children}
      </div>
    </SubTabsContext.Provider>
  );
}

function MainTabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-lg p-1", className)} {...props}>
      {children}
    </div>
  );
}

interface MainTabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

function MainTabTrigger({ className, value, children, ...props }: MainTabTriggerProps) {
  const context = React.useContext(SubTabsContext);
  
  if (!context) {
    throw new Error("MainTabTrigger must be used within a SubTabs component");
  }
  
  const { activeMainTab, setActiveMainTab, setActiveSubTab } = context;
  const isActive = activeMainTab === value;
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-background text-foreground shadow-sm" 
          : "text-muted-foreground hover:bg-muted-foreground/10",
        className
      )}
      onClick={() => {
        setActiveMainTab(value);
        // Reset sub-tab when main tab changes
        setActiveSubTab("");
      }}
      {...props}
    >
      {children}
    </button>
  );
}

interface MainTabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

function MainTabContent({ value, children, className, ...props }: MainTabContentProps) {
  const context = React.useContext(SubTabsContext);
  
  if (!context) {
    throw new Error("MainTabContent must be used within a SubTabs component");
  }
  
  const { activeMainTab } = context;
  
  if (activeMainTab !== value) {
    return null;
  }
  
  return (
    <div className={cn("mt-2", className)} {...props}>
      {children}
    </div>
  );
}

function SubTabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-b flex flex-wrap", className)} {...props}>
      {children}
    </div>
  );
}

interface SubTabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

function SubTabTrigger({ className, value, children, ...props }: SubTabTriggerProps) {
  const context = React.useContext(SubTabsContext);
  
  if (!context) {
    throw new Error("SubTabTrigger must be used within a SubTabs component");
  }
  
  const { activeSubTab, setActiveSubTab } = context;
  const isActive = activeSubTab === value;
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 text-sm font-medium border-b-2 transition-colors",
        isActive 
          ? "border-primary text-primary" 
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
        className
      )}
      onClick={() => setActiveSubTab(value)}
      {...props}
    >
      {children}
    </button>
  );
}

interface SubTabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

function SubTabContent({ value, children, className, ...props }: SubTabContentProps) {
  const context = React.useContext(SubTabsContext);
  
  if (!context) {
    throw new Error("SubTabContent must be used within a SubTabs component");
  }
  
  const { activeSubTab } = context;
  
  if (activeSubTab !== value) {
    return null;
  }
  
  return (
    <div className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
}

export { 
  NestedTabs, NestedTabsList, NestedTabsTrigger, NestedTabsContent,
  SubTabs, MainTabsList, MainTabTrigger, MainTabContent,
  SubTabsList, SubTabTrigger, SubTabContent
} 