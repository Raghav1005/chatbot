"use client"

import * as React from "react"
import { Bot } from "lucide-react"

export const ChatLoading = React.memo(function ChatLoading() {
  const [dots, setDots] = React.useState("")

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex w-full gap-4 p-4 bg-muted/30">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-secondary text-secondary-foreground">
        <Bot className="h-4 w-4 animate-pulse" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-muted-foreground font-medium">AI is thinking{dots}</span>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    </div>
  )
})
