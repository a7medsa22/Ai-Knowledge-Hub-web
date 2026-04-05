import { useState } from "react";
import { Search, Plus, Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocation, Link } from "react-router-dom";
import { GlobalSearch } from "./GlobalSearch";

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/documents": "Library",
  "/notes": "Notes",
  "/tasks": "Tasks",
  "/ai": "AI Tools",
  "/settings": "Settings",
};

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

export function TopBar({ onMobileMenuToggle }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = [
    { label: "Home", path: "/" },
    ...pathSegments.map((seg, i) => ({
      label: routeNames["/" + pathSegments.slice(0, i + 1).join("/")] || seg.charAt(0).toUpperCase() + seg.slice(1),
      path: "/" + pathSegments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-4">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden rounded-xl" onClick={onMobileMenuToggle}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs */}
      <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.path} className="flex items-center gap-1">
            {i > 0 && <span className="mx-1">/</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={() => setSearchOpen(true)}
          className="relative w-full max-w-sm lg:max-w-md flex items-center gap-2 rounded-xl bg-muted/50 border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="hidden sm:flex rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 gap-1.5">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl w-40">
            <DropdownMenuItem asChild>
              <Link to="/documents?create=true" className="flex items-center">
                Document
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/notes?create=true" className="flex items-center">
                Note
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/tasks?create=true" className="flex items-center">
                Task
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            {user && <DropdownMenuItem disabled className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>}
            <DropdownMenuItem asChild><Link to="/settings">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
