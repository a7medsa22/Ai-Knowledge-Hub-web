import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiResultCard } from "@/components/ai/AiResultCard";
import { documentsService } from "@/services/documents";
import { aiService } from "@/services/ai";
import { notesService } from "@/services/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash2, MoreVertical, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoteCard } from "@/components/notes/NoteCard";

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiContent, setAiContent] = useState<string | null>(null);

  // Edit state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: document } = useQuery({
    queryKey: ["document", id],
    queryFn: () => documentsService.getById(id ?? ""),
    enabled: !!id,
  });

  const { data: relatedNotes } = useQuery({
    queryKey: ["document-notes", id],
    queryFn: () => notesService.getByDocument(id ?? ""),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      documentsService.update(id ?? "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", id] });
      setIsEditDialogOpen(false);
      toast({ title: "Success", description: "Document updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update document", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => documentsService.delete(id ?? ""),
    onSuccess: () => {
      toast({ title: "Success", description: "Document deleted successfully" });
      navigate("/documents");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete document", variant: "destructive" });
    },
  });

  const handleEditOpen = () => {
    if (document) {
      setEditTitle(document.title);
      setEditContent(document.content || "");
      setIsEditDialogOpen(true);
    }
  };

  const handleEditSave = () => {
    updateMutation.mutate({ title: editTitle, content: editContent });
  };

  const handleAction = async (action: string) => {
    if (!id) return;

    setLoading(true);
    setActiveAction(null);
    setAiContent(null);

    try {
      let content = "";

      if (action === "summarize") {
        const response = await aiService.summarize({ docId: id, length: "medium" });
        content = response.summary;
      } else if (action === "question") {
        const response = await aiService.ask({
          docId: id,
          question: "What are the key insights from this document?",
        });
        content = response.answer;
      } else if (action === "extract") {
        const response = await aiService.extractKeyPoints({ docId: id, maxPoints: 5 });
        content = response.keyPoints.join("\n• ");
      }

      setActiveAction(action);
      setAiContent(content || "The AI service returned an empty response.");
    } catch {
      setActiveAction(action);
      setAiContent("Sorry, something went wrong while contacting the AI service.");
    } finally {
      setLoading(false);
    }
  };

  const actionLabels: Record<string, string> = {
    summarize: "AI Summary",
    question: "AI Answer",
    extract: "Key Points",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <Link to="/documents" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Documents
      </Link>

      {/* AI Actions bar */}
      <div className="sticky top-0 z-10 -mx-6 px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex gap-2 flex-wrap items-center">
          {[
            { key: "summarize", label: "Summarize" },
            { key: "question", label: "Ask Question" },
            { key: "extract", label: "Extract Key Points" },
          ].map((action) => (
            <Button
              key={action.key}
              variant="secondary"
              className="rounded-xl gap-1.5"
              onClick={() => handleAction(action.key)}
              disabled={loading}
            >
              <Brain className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
          
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-9 w-9"
              onClick={handleEditOpen}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-9 w-9 text-destructive hover:bg-destructive/10"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <article>
        <h1 className="text-3xl font-bold mb-6">{document?.title ?? "Loading document..."}</h1>
        <div className="text-base leading-[1.6] text-muted-foreground whitespace-pre-line max-w-[720px]">
          {document?.content ?? ""}
        </div>
      </article>

      {/* AI Result */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:200ms]" />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:400ms]" />
          </div>
          AI is thinking...
        </div>
      )}

      {activeAction && aiContent && (
        <AiResultCard
          title={actionLabels[activeAction]}
          content={aiContent}
          visible
        />
      )}

      {/* Related Notes */}
      {relatedNotes && relatedNotes.length > 0 && (
        <section className="pt-8 border-t border-border">
          <h2 className="text-xl font-bold mb-4">Related Notes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title || (note.content.split('\n')[0].slice(0, 40) || "Untitled Note")}
                excerpt={note.content}
                tag={note.tags?.[0] ?? "Note"}
                timestamp={new Date(note.createdAt).toLocaleDateString()}
              />
            ))}
          </div>
        </section>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>Modify the document title and content.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[300px] rounded-xl resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={updateMutation.isPending}
              className="rounded-xl bg-primary text-primary-foreground"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="rounded-xl"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentDetail;
