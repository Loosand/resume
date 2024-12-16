import { useState } from "react"
import { MessageSquarePlus, Sparkles, WandIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SelectionMenuProps {
  position: { x: number; y: number } | null
  selectedText: string
  onAction: (type: string, customPrompt?: string) => void
  onClose: () => void
}

export function SelectionMenu({
  position,
  selectedText,
  onAction,
  onClose,
}: SelectionMenuProps) {
  const [customPrompt, setCustomPrompt] = useState("")
  const [showInput, setShowInput] = useState(false)

  if (!position) return null

  const handleAction = (type: string) => {
    if (type === "custom") {
      setShowInput(true)
      return
    }
    onAction(type)
    onClose()
  }

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault()
    if (customPrompt.trim()) {
      onAction("custom", customPrompt)
      setCustomPrompt("")
      setShowInput(false)
      onClose()
    }
  }

  return (
    <div
      className="fixed z-50 animate-in fade-in"
      style={{ top: position.y, left: position.x }}
    >
      <DropdownMenu open={true}>
        <DropdownMenuContent className="min-w-[200px]">
          {!showInput ? (
            <>
              <DropdownMenuItem onClick={() => handleAction("polish")}>
                <WandIcon className="mr-2 h-4 w-4" />
                润色经历
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("optimize")}>
                <Sparkles className="mr-2 h-4 w-4" />
                优化措辞
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("suggest")}>
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                给出建议
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("custom")}>
                自定义优化
              </DropdownMenuItem>
            </>
          ) : (
            <form onSubmit={handleSubmitCustom} className="p-2">
              <Input
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="请输入优化需求..."
                className="mb-2"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInput(false)}
                >
                  取消
                </Button>
                <Button type="submit" size="sm">
                  确定
                </Button>
              </div>
            </form>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
