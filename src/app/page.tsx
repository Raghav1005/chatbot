"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { ChatWelcome } from "@/components/chat-welcome";
import { ChatLoading } from "@/components/chat-loading";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatPart = { type: "text"; text: string };

type Message = {
  id: string;
  role: "user" | "assistant";
  parts: ChatPart[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("x-ai/grok-4-fast:free");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, isLoading]);

  const handleNewChat = () => setMessages([]);
  const handleModelChange = (model: string) => setSelectedModel(model);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: input }],
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();

      // Convert API response to Message format
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        parts: [{ type: "text", text: data.message?.content || data.message || "No response" }],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChatHeader
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onNewChat={handleNewChat}
      />

      <div className="flex flex-1 flex-col">
        <ScrollArea ref={scrollAreaRef} className="flex-1">
          <div className="flex flex-col overflow-x-auto">
            {messages.length === 0 && <ChatWelcome />}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="px-4 py-2 text-muted-foreground">
                <ChatLoading />
              </div>
            )}
          </div>
        </ScrollArea>

        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
