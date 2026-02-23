import { useState } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users";

export function ApiKeyCard() {
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["api-key"],
    queryFn: usersService.getProfile,
  });

  if (data && !apiKey) {
    setApiKey(data.id);
  }

  const regenerateMutation = useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-key"] });
      toast({ title: "API key regenerated" });
    },
    onError: () => {
      toast({
        title: "Regeneration failed",
        description: "Could not regenerate your API key. Please try again.",
        variant: "destructive",
      });
    },
  });

  const masked = apiKey ? `sk_****${apiKey.slice(-4)}` : "Loading...";

  const handleCopy = () => {
    if (!apiKey) return;
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
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl shrink-0"
            onClick={handleCopy}
            disabled={isLoading || !apiKey}
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Use this key to authenticate API requests</p>
        <Button
          variant="outline"
          className="rounded-xl"
          disabled={regenerateMutation.isPending}
          onClick={() => regenerateMutation.mutate({})}
        >
          <RefreshCw className="h-4 w-4 mr-1" /> Regenerate Key
        </Button>
      </div>
    </div>
  );
}
