import React, { KeyboardEvent, useState, useRef } from "react"
import { Paperclip, Send, StopCircle, X } from "lucide-react"

import { FilePreview } from "./FilePreview"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent, attachments?: File[]) => void
  onStop: () => void
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onStop,
}) => {
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e, attachments)
    setAttachments([])
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative flex flex-col">
        {attachments.length > 0 && (
          <div className="mb-2">
            <FilePreview files={attachments} onRemove={handleRemoveFile} />
          </div>
        )}
        <div className="relative flex-1">
          <div className="absolute left-2 top-1/2 flex -translate-y-1/2 items-center gap-2 text-muted-foreground">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
          </div>
          <Textarea
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow up..."
            className={cn(
              "resize-none bg-background py-3 pl-12 pr-10 text-base",
              "max-h-[200px] min-h-[44px] rounded-lg border focus-visible:ring-0",
              "focus-visible:border-border focus-visible:ring-offset-0",
              "scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400",
              "overflow-y-hidden hover:overflow-y-auto",
            )}
            rows={1}
          />
          {(input.trim() || attachments.length > 0) && (
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-background hover:bg-background"
                onClick={onStop}
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
