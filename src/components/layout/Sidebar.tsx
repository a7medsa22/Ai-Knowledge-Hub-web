import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { File, BookOpen, CheckCircle, Bot, Settings, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { title: "Documents", url: "/documents", icon: File },
  { title: "Notes", url: "/notes", icon: BookOpen },
  { title: "Tasks", url: "/tasks", icon: CheckCircle },
  { title: "AI Tools", url: "/ai", icon: Bot },
  { title: "Settings", url: "/settings", icon: Settings },
];

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
        return (
          <NavLink
            key={item.url}
            to={item.url}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.title}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border bg-background transition-all duration-200 shrink-0",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent truncate">
              AI Hub
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0 rounded-xl">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-[260px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
              AI Hub
            </span>
          </div>
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}
