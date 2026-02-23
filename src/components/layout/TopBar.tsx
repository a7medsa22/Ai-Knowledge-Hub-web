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

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/documents": "Documents",
  "/notes": "Notes",
  "/tasks": "Tasks",
  "/ai": "AI Tools",
  "/settings": "Settings",
};

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

export function TopBar({ onMobileMenuToggle }: TopBarProps) {
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
        <div className="relative w-full max-w-sm lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 rounded-xl bg-muted/50 border-border"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button className="hidden sm:flex rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 gap-1.5">
          <Plus className="h-4 w-4" />
          New
        </Button>
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
