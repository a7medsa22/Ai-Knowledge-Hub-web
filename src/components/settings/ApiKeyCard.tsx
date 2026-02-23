import { useState } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function ApiKeyCard() {
  const [apiKey] = useState("sk_live_a1b2c3d4e5f6g7h8i9j0");
  const [copied, setCopied] = useState(false);

  const masked = `sk_****${apiKey.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({ title: "API key copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">API</h2>
        <p className="text-sm text-muted-foreground">Manage your API access keys</p>
      </div>

      <div className="space-y-3 max-w-md">
        <Label>API Key</Label>
        <div className="flex gap-2">
          <Input value={masked} readOnly className="rounded-xl font-mono" />
          <Button variant="outline" size="icon" className="rounded-xl shrink-0" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Use this key to authenticate API requests</p>
        <Button variant="outline" className="rounded-xl">
          <RefreshCw className="h-4 w-4 mr-1" /> Regenerate Key
        </Button>
      </div>
    </div>
  );
}
