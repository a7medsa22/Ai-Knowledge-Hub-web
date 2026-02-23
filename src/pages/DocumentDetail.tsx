import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiResultCard } from "@/components/ai/AiResultCard";
import { documentsService } from "@/services/documents";
import { aiService } from "@/services/ai";

const DocumentDetail = () => {
  const { id } = useParams();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiContent, setAiContent] = useState<string | null>(null);

  const { data: document } = useQuery({
    queryKey: ["document", id],
    queryFn: () => documentsService.getById(id ?? ""),
    enabled: !!id,
  });

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
        <div className="flex gap-2 flex-wrap">
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
    </div>
  );
};

export default DocumentDetail;
