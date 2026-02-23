import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bot, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessage, TypingIndicator } from "@/components/ai/ChatMessage";
import { ChatInput } from "@/components/ai/ChatInput";
import { cn } from "@/lib/utils";
import { aiService } from "@/services/ai";
import { documentsService } from "@/services/documents";

interface Message {
  role: "user" | "ai";
  content: string;
}

const promptExamples = [
  "Summarize my notes about transformer architecture",
  "What are the key differences between RAG approaches?",
  "Help me draft a document about prompt engineering",
];

const tools = ["Summarize", "Q&A", "Extract"];

const AiTools = () => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTool, setActiveTool] = useState("Q&A");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: myDocuments, isLoading: docsLoading } = useQuery({
    queryKey: ["documents", "my"],
    queryFn: documentsService.getMyDocuments,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      let aiText = "";

      if (activeTool === "Summarize") {
        const response = await aiService.summarize({ 
          text: selectedDocId ? undefined : content, 
          docId: selectedDocId || undefined,
          length: "short" 
        });
        aiText = response.summary;
      } else if (activeTool === "Q&A") {
        const response = await aiService.ask({ 
          question: content,
          docId: selectedDocId || undefined
        });
        aiText = response.answer;
      } else {
        const response = await aiService.extractKeyPoints({ 
          text: selectedDocId ? undefined : content, 
          docId: selectedDocId || undefined,
          maxPoints: 5 
        });
        aiText = response.keyPoints.join("\n• ");
      }

      const aiMessage: Message = {
        role: "ai",
        content: aiText || "The AI service returned an empty response.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I couldn't reach the AI service. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 animate-fade-in">
      {/* Chat area */}
      <div className="flex-1 lg:w-[60%] flex flex-col rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">Ask questions about your documents, get summaries, or extract key insights.</p>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {promptExamples.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-left text-sm rounded-xl border border-border px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 inline mr-2 text-muted-foreground" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <ChatMessage key={i} {...msg} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>

      {/* Context panel */}
      <div className="lg:w-[40%] space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tool</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            {tools.map((tool) => (
              <Button
                key={tool}
                variant={activeTool === tool ? "default" : "secondary"}
                className={cn("rounded-xl", activeTool === tool && "bg-gradient-to-r from-indigo-500 to-violet-600 text-white")}
                onClick={() => setActiveTool(tool)}
              >
                {tool}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attached Documents</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            {docsLoading && (
              <span className="text-xs text-muted-foreground">Loading documents…</span>
            )}
            {!docsLoading && myDocuments && myDocuments.length === 0 && (
              <span className="text-xs text-muted-foreground">No documents yet.</span>
            )}
            {!docsLoading &&
              (myDocuments ?? []).slice(0, 8).map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(current => current === doc.id ? null : doc.id)}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors border",
                    selectedDocId === doc.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-primary/10 text-primary border-transparent hover:bg-primary/20"
                  )}
                >
                  {doc.title}
                </button>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiTools;
