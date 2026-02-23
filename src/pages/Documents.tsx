import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { DocumentCard } from "@/components/documents/DocumentCard";

const Documents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

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

  const { data: stats } = useQuery({
    queryKey: ["documents", "stats"],
    queryFn: documentsService.getStats,
  });

  const { data: tags } = useQuery({
    queryKey: ["documents", "tags"],
    queryFn: documentsService.getTags,
  });

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents", { search: debouncedSearch, selectedTag }],
    queryFn: () =>
      documentsService.getAll({
        search: debouncedSearch || undefined,
        tags: selectedTag ? [selectedTag] : undefined,
      }),
  });

  const { mutate: createDoc, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const tagList = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      if (createMode === "file" && file) {
        return documentsService.createFromFile({ title, file, tags: tagList });
      } else {
        return documentsService.create({ title, content, tags: tagList });
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
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage your knowledge base
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
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
            <DocumentCard
              key={doc.id}
              title={doc.title}
              excerpt={doc.content?.slice(0, 160) || ""}
              size={doc.stats ? `${doc.stats.downloads} downloads` : ""}
              date={new Date(doc.createdAt).toLocaleDateString()}
              tags={doc.tags}
            />
          ))}
      </div>
    </div>
  );
};
export default Documents;
