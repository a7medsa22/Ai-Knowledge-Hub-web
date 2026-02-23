import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Moon, Monitor } from "lucide-react";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Appearance</h2>
        <p className="text-sm text-muted-foreground">Customize how AI Knowledge Hub looks</p>
      </div>

      <div className="flex gap-3">
        {themes.map((t) => (
          <Button
            key={t.value}
            variant="outline"
            onClick={() => setTheme(t.value)}
            className={cn(
              "flex-1 flex-col h-auto py-4 gap-2 rounded-xl transition-all duration-200",
              theme === t.value && "ring-2 ring-primary border-primary"
            )}
          >
            <t.icon className="h-5 w-5" />
            <span className="text-xs">{t.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
