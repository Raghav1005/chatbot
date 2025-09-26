"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ModelSelector } from "./model-selector"
import { MessageSquare, Plus, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface ChatHeaderProps {
  selectedModel: string
  onModelChange: (model: string) => void
  onNewChat: () => void
}

export const ChatHeader = React.memo(function ChatHeader({ selectedModel, onModelChange, onNewChat }: ChatHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              ChatGPT Clone
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:block">
              <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
            </div>

            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-9 w-9 p-0"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={onNewChat} className="gap-2 bg-transparent hover:bg-muted/50">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </div>
        </div>

        <div className="block sm:hidden px-4 pb-3">
          <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
        </div>
      </div>
    </header>
  )
})
