import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-violet-600"
            : "bg-muted"
        )}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-tr-md"
            : "bg-muted rounded-tl-md"
        )}
      >
        {content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-muted">
        <Bot className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:200ms]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:400ms]" />
      </div>
    </div>
  );
}
