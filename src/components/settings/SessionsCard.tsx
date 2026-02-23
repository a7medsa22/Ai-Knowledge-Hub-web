import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/auth";
import { Clock3, MonitorSmartphone, RefreshCw, Trash2 } from "lucide-react";

export function SessionsCard() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: authService.getSessions,
  });

  const sessions = data?.data?.sessions ?? [];

  const revokeAllMutation = useMutation({
    mutationFn: authService.revokeAllSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: authService.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Sessions</h2>
        <p className="text-sm text-muted-foreground">
          View and manage devices that are currently signed in to your account.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MonitorSmartphone className="h-4 w-4" />
          <span>{isLoading ? "Loading sessions…" : `${sessions.length} active session(s)`}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-1.5"
          disabled={revokeAllMutation.isPending || sessions.length === 0}
          onClick={() => revokeAllMutation.mutate()}
        >
          <Trash2 className="h-4 w-4" />
          Sign out from all
        </Button>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground">No active sessions found.</p>
        )}

        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Session {s.id.slice(0, 6)}</span>
                  <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0.5">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3 w-3" />
                  <span>Created: {new Date(s.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3" />
                  <span>Last active: {new Date(s.lastActiveAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={revokeMutation.isPending}
              onClick={() => revokeMutation.mutate(s.id)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Sign out
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

