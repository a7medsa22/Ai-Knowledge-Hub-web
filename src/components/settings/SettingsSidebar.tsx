import { User, Shield, Palette, Key, MonitorSmartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "sessions", label: "Sessions", icon: MonitorSmartphone },
  { id: "api", label: "API", icon: Key },
];

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onSectionChange(s.id)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap",
            activeSection === s.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <s.icon className="h-4 w-4 shrink-0" />
          <span>{s.label}</span>
        </button>
      ))}
    </nav>
  );
}
