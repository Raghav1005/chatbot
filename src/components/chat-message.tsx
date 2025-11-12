"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    parts: Array<{
      type: "text";
      text: string;
    }>;
  };
}

export const ChatMessage = React.memo(function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();
  const isUser = message.role === "user";

  const content = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({ title: "Copied!", description: "Message copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("[v0] Failed to copy:", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard",
        variant: "destructive",
      });
    }
  }, [content, toast]);

  return (
    <div
      className={cn(
        "group relative flex w-full gap-4 p-4 transition-colors hover:bg-muted/20",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md transition-colors",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {isUser ? (
            <p className="text-foreground whitespace-pre-wrap">{content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
                      {children}
                    </code>
                  ) : (
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 my-4">
                      <code className="text-sm font-mono text-foreground">{children}</code>
                    </pre>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0" title="Copy message">
          {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
});
