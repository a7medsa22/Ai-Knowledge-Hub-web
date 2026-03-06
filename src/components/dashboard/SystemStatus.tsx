import { useQuery } from "@tanstack/react-query";
import { Activity, CheckCircle2, AlertCircle, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiService } from "@/services/ai";
import { mcpService } from "@/services/mcp";
import { cn } from "@/lib/utils";

export function SystemStatus() {
  const { data: aiStatus, isLoading: aiLoading } = useQuery({
    queryKey: ["ai", "status"],
    queryFn: aiService.getStatus,
    refetchInterval: 30000, // Refresh every 30s
  });

  const { data: mcpHealth, isLoading: mcpLoading } = useQuery({
    queryKey: ["mcp", "health"],
    queryFn: mcpService.healthCheck,
    refetchInterval: 30000,
  });

  const StatusItem = ({ 
    label, 
    status, 
    loading, 
    icon: Icon 
  }: { 
    label: string; 
    status?: string | boolean; 
    loading: boolean; 
    icon: any 
  }) => {
    const isOnline = status === "online" || status === "healthy" || status === true;
    
    return (
      <div className="flex items-center justify-between p-2 rounded-xl border border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            isOnline ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse" />
          ) : (
            <>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isOnline ? "text-emerald-500" : "text-red-500"
              )}>
                {isOnline ? "Online" : "Offline"}
              </span>
              <div className={cn(
                "h-2 w-2 rounded-full",
                isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              )} />
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-2xl border-border bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          System Engine Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-4 space-y-3">
        <StatusItem 
          label="AI Processing Unit" 
          status={aiStatus?.available} 
          loading={aiLoading} 
          icon={BrainIcon} 
        />
        <StatusItem 
          label="MCP Protocol Layer" 
          status={mcpHealth?.healthy} 
          loading={mcpLoading} 
          icon={Cpu} 
        />
        {aiStatus?.version && (
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            <span>Core Version</span>
            <span>{aiStatus.version}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BrainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5" />
      <path d="M12 12a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5" />
      <path d="M6 7h12" />
      <path d="M6 17h12" />
    </svg>
  );
}
