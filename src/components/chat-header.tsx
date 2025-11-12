"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ModelSelector } from "./model-selector"
import { MessageSquare, Plus, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { ChevronDown } from "lucide-react"

interface ChatHeaderProps {
  selectedModel: string
  onModelChange: (model: string) => void
  onNewChat: () => void
  onLoadHistory?: () => void
}

export const ChatHeader = React.memo(function ChatHeader({ selectedModel, onModelChange, onNewChat, onLoadHistory }: ChatHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [openProviders, setOpenProviders] = React.useState(false)

  const providers = [
    { id: "openai/gpt-oss-20b:free", label: "ChatGPT (gpt-oss-20b)" },
    { id: "nvidia/nemotron-nano-9b-v2:free", label: "NVIDIA Nemotron 9B V2" },
  ]

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
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={() => setOpenProviders((s) => !s)} className="h-9 w-auto p-2 gap-2">
                Providers
                <ChevronDown className="h-4 w-4" />
              </Button>
              {openProviders && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-2 shadow-md z-50">
                  {providers.map((p) => (
                    <button
                      key={p.id}
                      className="w-full text-left px-2 py-2 hover:bg-muted/30 rounded text-sm"
                      onClick={() => {
                        onModelChange(p.id)
                        setOpenProviders(false)
                        // load history for that model
                        onLoadHistory?.()
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => onLoadHistory?.()} className="gap-2">
                <span className="hidden sm:inline">History</span>
              </Button>
              <Button variant="outline" size="sm" onClick={onNewChat} className="gap-2 bg-transparent hover:bg-muted/50">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="block sm:hidden px-4 pb-3">
          <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
        </div>
      </div>
    </header>
  )
})
