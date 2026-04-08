import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, Tag, FileText, Upload, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { documentsService } from "@/services/documents";
import { aiService } from "@/services/ai";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { useNavigate } from "react-router-dom";

const Documents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsCreateOpen(true);
      // Clean up the URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("create");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkSummary, setBulkSummary] = useState<{ docId: string; title: string; summary: string }[] | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
  
  // Create state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"text" | "file">("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  
  // Pagination & Sorting state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"all" | "my">("all");

  const { data: stats } = useQuery({
    queryKey: ["documents", "stats"],
    queryFn: documentsService.getStats,
  });

  const { data: tags } = useQuery({
    queryKey: ["documents", "tags"],
    queryFn: documentsService.getTags,
  });

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents", { search: debouncedSearch, selectedTag, page, limit, sortBy, sortOrder, viewMode }],
    queryFn: () => {
      if (viewMode === "my") {
        return documentsService.getMyDocuments();
      }
      return documentsService.getAll({
        search: debouncedSearch || undefined,
        tags: selectedTag ? [selectedTag] : undefined,
        page,
        limit,
        // @ts-ignore
        sortBy: sortBy,
        // @ts-ignore
        sortOrder: sortOrder,
      });
    },
    placeholderData: keepPreviousData
  });

  const { mutate: createDoc, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const tagList = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      if (createMode === "file" && file) {
        return documentsService.createFromFile({ title, file, tags: tagList, isPublic });
      } else {
        return documentsService.create({ title, content, tags: tagList, isPublic });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Success", description: "Document created successfully" });
    },
    onError: (err: any) => {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to create document",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFile(null);
    setTagsInput("");
    setIsPublic(true);
  };

  const handleToggleSelection = (id: string) => {
    setSelectedIds(current => 
      current.includes(id) 
        ? current.filter(i => i !== id) 
        : [...current, id]
    );
  };

  const handleBulkSummarize = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkLoading(true);
    try {
      const response = await aiService.bulkSummarize({ docIds: selectedIds, length: "short" });
      setBulkSummary(response.summaries);
      toast({ title: "Bulk Summary Complete", description: `Generated summaries for ${response.summaries.length} documents.` });
    } catch {
      toast({ title: "Error", description: "Failed to generate bulk summaries.", variant: "destructive" });
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Library</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage your library
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" /> New Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex p-1 bg-muted rounded-xl gap-1">
                <Button 
                  variant={createMode === "text" ? "secondary" : "ghost"} 
                  className="flex-1 rounded-lg h-8 text-xs"
                  onClick={() => setCreateMode("text")}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" /> Text Content
                </Button>
                <Button 
                  variant={createMode === "file" ? "secondary" : "ghost"} 
                  className="flex-1 rounded-lg h-8 text-xs"
                  onClick={() => setCreateMode("file")}
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" /> File Upload
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter document title"
                  className="rounded-xl"
                />
              </div>

              {createMode === "text" ? (
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Enter document text content..."
                    className="min-h-[150px] rounded-xl"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">{file ? file.name : "Click to upload or drag and drop"}</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT up to 10MB</p>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept=".pdf,.docx,.doc,.txt"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  value={tagsInput} 
                  onChange={(e) => setTagsInput(e.target.value)} 
                  placeholder="ai, research, ml"
                  className="rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between py-2 px-1 border border-border/50 rounded-xl">
                <div className="space-y-0.5 px-2">
                  <Label className="text-sm font-medium">Public Access</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Allow others to search and view
                  </p>
                </div>
                <div 
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${isPublic ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  onClick={() => setIsPublic(!isPublic)}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPublic ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl">Cancel</Button>
              <Button 
                onClick={() => createDoc()} 
                disabled={isCreating || !title || (createMode === "text" ? !content : !file)}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
              >
                {isCreating ? "Creating..." : "Create Document"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-primary/5 backdrop-blur-md border-b border-primary/20 flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{selectedIds.length} documents selected</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedIds([])}
              className="text-xs h-8 rounded-lg"
            >
              Clear
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-xl gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
              onClick={handleBulkSummarize}
              disabled={isBulkLoading}
            >
              <Brain className="h-4 w-4" />
              {isBulkLoading ? "Summarizing..." : "Bulk Summarize"}
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Summary Results */}
      {bulkSummary && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Bulk AI Summaries</h2>
              <Button variant="ghost" size="icon" onClick={() => setBulkSummary(null)}>
                <Plus className="h-4 w-4 rotate-45" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {bulkSummary.map((s) => (
                <div key={s.docId} className="bg-background rounded-xl p-4 border border-border">
                  <h3 className="font-semibold text-sm mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex p-1 bg-muted rounded-xl gap-1 sm:w-fit">
          <Button 
            variant={viewMode === "all" ? "secondary" : "ghost"} 
            className="rounded-lg h-8 text-xs px-4"
            onClick={() => setViewMode("all")}
          >
            All Public
          </Button>
          <Button 
            variant={viewMode === "my" ? "secondary" : "ghost"} 
            className="rounded-lg h-8 text-xs px-4"
            onClick={() => setViewMode("my")}
          >
            My Documents
          </Button>
        </div>

        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl sm:max-w-xs"
        />
        
        <select 
          className="bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split(":");
            setSortBy(s);
            setSortOrder(o as "asc" | "desc");
          }}
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="title:asc">A-Z</option>
        </select>

        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {(tags ?? []).map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs"
              onClick={() =>
                setSelectedTag((current) => (current === tag ? null : tag))
              }
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <DocumentCard
              key={i}
              title=""
              excerpt=""
              size=""
              date=""
              tags={[]}
              loading
            />
          ))}

        {!isLoading &&
          documents?.map((doc) => (
            <div key={doc.id} onClick={() => navigate(`/documents/${doc.id}`)} className="cursor-pointer">
              <DocumentCard
                title={doc.title}
                excerpt={doc.content?.slice(0, 160) || ""}
                size={doc.stats ? `${doc.stats.downloads} downloads` : ""}
                date={new Date(doc.createdAt).toLocaleDateString()}
                tags={doc.tags}
                isSelected={selectedIds.includes(doc.id)}
                onSelect={() => handleToggleSelection(doc.id)}
              />
            </div>
          ))}
      </div>

      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">
          Showing {documents?.length || 0} documents
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl"
            disabled={(documents?.length || 0) < limit}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Documents;
