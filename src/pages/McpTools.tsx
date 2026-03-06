import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Cpu, Play, Terminal, Info, Search, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { mcpService, type MCPTool } from "@/services/mcp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const McpTools = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState<any | null>(null);
  const [toolArguments, setToolArguments] = useState("{}");
  const [toolResult, setToolResult] = useState<any | null>(null);
  
  const { data: tools = [], isLoading } = useQuery<MCPTool[]>({
    queryKey: ["mcp", "tools"],
    queryFn: mcpService.getTools,
  });

  const callToolMutation = useMutation({
    mutationFn: (data: { name: string; arguments: any }) => 
      mcpService.execute({ toolName: data.name, parameters: data.arguments }),
    onSuccess: (result) => {
      setToolResult(result);
      toast({ title: "Success", description: `Tool ${selectedTool?.name} executed successfully` });
    },
    onError: (err: any) => {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to execute tool",
        variant: "destructive"
      });
    }
  });

  const handleExecute = () => {
    try {
      const args = JSON.parse(toolArguments);
      callToolMutation.mutate({ name: selectedTool.name, arguments: args });
    } catch {
      toast({ title: "Error", description: "Invalid JSON arguments", variant: "destructive" });
    }
  };

  const filteredTools = (tools || []).filter((t: MCPTool) => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
             <Cpu className="h-10 w-10 text-primary" />
             MCP Tools
          </h1>
          <p className="text-muted-foreground mt-1">Access and execute Model Context Protocol capabilities</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-border bg-card/80">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
          <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No tools available</h2>
          <p className="text-muted-foreground">The MCP server might be offline or no tools are registered</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <Card key={tool.name} className="rounded-2xl border-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 flex flex-col group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="rounded-lg bg-primary/5 text-primary border-primary/20">
                    Tool
                  </Badge>
                  <Zap className="h-4 w-4 text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {tool.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-2">
                <Button 
                  onClick={() => {
                    setSelectedTool(tool);
                    setToolArguments(JSON.stringify(tool.parameters || {}, null, 2));
                    setToolResult(null);
                  }}
                  className="w-full rounded-xl gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  <Play className="h-4 w-4" /> Configure & Run
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Execute Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={(open) => !open && setSelectedTool(null)}>
        <DialogContent className="sm:max-w-[700px] rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
               <Terminal className="h-5 w-5 text-primary" />
               Execute {selectedTool?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Info className="h-4 w-4" /> Tool Description
              </div>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                {selectedTool?.description || "No description available."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Terminal className="h-4 w-4" /> JSON Arguments
              </div>
              <Textarea 
                value={toolArguments}
                onChange={(e) => setToolArguments(e.target.value)}
                className="font-mono text-xs min-h-[150px] rounded-xl bg-muted/50 border-border"
              />
            </div>

            {toolResult && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> Result Output
                </div>
                <pre className="text-[10px] bg-emerald-500/5 text-emerald-700 p-4 rounded-xl border border-emerald-500/20 overflow-x-auto">
                  {JSON.stringify(toolResult, null, 2)}
                </pre>
              </div>
            )}
            
            {callToolMutation.isPending && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={() => setSelectedTool(null)} className="rounded-xl">Close</Button>
            <Button 
              onClick={handleExecute}
              disabled={callToolMutation.isPending}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white min-w-[120px]"
            >
              {callToolMutation.isPending ? "Executing..." : "Run Tool"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default McpTools;

function CheckCircle2(props: any) {
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
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
