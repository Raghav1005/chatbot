"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

const models = [
  {
    id: "openai/gpt-oss-20b:free",
    name: "OpenAI: gpt-oss-20b",
    provider: "OpenAI",
    description: "Open-weight 21B-parameter model released under Apache 2.0, with 3.6B active parameters per forward pass.",
    tier: "free",
  },
  {
    id: "nvidia/nemotron-nano-9b-v2:free",
    name: "NVIDIA: Nemotron Nano 9B V2",
    provider: "NVIDIA",
    description: "A large LLM trained from scratch by NVIDIA, designed for both reasoning and non-reasoning tasks.",
    tier: "free",
  },
];


export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const selectedModelInfo = models.find((m) => m.id === selectedModel)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:inline">Model:</span>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-[180px] sm:w-[220px]">
          <SelectValue>
            {selectedModelInfo ? (
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs text-muted-foreground hidden sm:inline">{selectedModelInfo.provider}</span>
                <span className="truncate">{selectedModelInfo.name}</span>
                {selectedModelInfo.tier === "premium" && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    Pro
                  </Badge>
                )}
              </div>
            ) : (
              "Select model"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-[300px]">
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id} className="cursor-pointer">
              <div className="flex flex-col gap-1 py-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  {model.tier === "premium" && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      Pro
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{model.provider}</span>
                  <span>•</span>
                  <span>{model.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
