"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Zap, Shield, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatWelcomeProps {
  onExampleClick?: (example: string) => void
}

export const ChatWelcome = React.memo(function ChatWelcome({ onExampleClick }: ChatWelcomeProps) {
  const features = [
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Engage in human-like conversations with advanced AI models",
    },
    {
      icon: Zap,
      title: "Multiple Models",
      description: "Choose from GPT-4, Claude, Gemini, and more via OpenRouter",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your conversations are processed securely through OpenRouter",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access the best AI models from around the world in one place",
    },
  ]

  const examplePrompts = [
    "Explain quantum computing in simple terms",
    "Write a creative story about time travel",
    "Help me plan a healthy meal prep for the week",
    "Debug this JavaScript code for me",
  ]

  const handleExampleClick = React.useCallback(
    (example: string) => {
      onExampleClick?.(example)
    },
    [onExampleClick],
  )

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center">
        <div className="mb-8">
          <div className="relative mb-6">
            <MessageSquare className="mx-auto h-16 w-16 text-primary" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-balance mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Welcome to ChatGPT Clone
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Experience the power of multiple AI models in one unified interface. Start a conversation to explore what's
            possible with cutting-edge artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-left hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <feature.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {onExampleClick && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Try these examples:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {examplePrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start h-auto p-4 hover:bg-muted/50 transition-colors bg-transparent"
                  onClick={() => handleExampleClick(prompt)}
                >
                  <span className="text-sm text-pretty">{prompt}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Type your message below to get started
          </p>
        </div>
      </div>
    </div>
  )
})
