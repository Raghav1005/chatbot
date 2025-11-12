"use client";

import { useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { Loader2 } from "lucide-react";
import { ChatHeader } from "@/components/chat-header";
import { ChatWelcome } from "@/components/chat-welcome";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("openai/gpt-oss-20b:free");

  const userId = "demoUser"; // Replace with real user later

  const { toast } = useToast();

  // History is loaded on-demand via header button
  const handleLoadHistory = async () => {
    try {
      const res = await fetch(`/api/chat?userId=${userId}&model=${encodeURIComponent(selectedModel)}`);
      const data = await res.json();
      if (data.ok && data.messages) {
        const mapped = data.messages.map((msg: any, i: number) => ({
          id: String(i),
          role: msg.role,
          parts: [{ type: "text", text: msg.content }],
        }));
        setMessages(mapped);
      } else {
        toast({ title: "No history", description: data.error || "No messages found for this model" });
      }
    } catch (err: any) {
      console.error("Error loading history:", err);
      toast({ title: "Failed to load history", description: err?.message || String(err), variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: input }],
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, messages: updatedMessages, model: selectedModel }),
      });

      const data = await res.json();

      if (data.ok && data.message) {
        // Append only the assistant's latest reply to avoid loading the entire saved history into the UI
        const assistant = data.message;
        const assistantMsg = {
          id: Date.now().toString(),
          role: assistant.role || "assistant",
          parts: [{ type: "text", text: assistant.content || String(assistant) }],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Model returned an error. Keep the local conversation (no heavy history injection) and show a toast.
        toast({ title: "Model error", description: data.error || "Model call failed", variant: "destructive" });
        // leave messages as-is (the user's message is already shown)
      }
    } catch (error) {
      console.error("\u274c Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
  <ChatHeader selectedModel={selectedModel} onModelChange={setSelectedModel} onNewChat={handleNewChat} onLoadHistory={handleLoadHistory} />

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && !isLoading && (
          <ChatWelcome onExampleClick={(example) => setInput(example)} />
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-center mt-4 text-muted-foreground">
            <Loader2 className="animate-spin mr-2 h-4 w-4" /> Thinking...
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
