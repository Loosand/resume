"use client"

import React from "react"
import dynamic from "next/dynamic"

import { TemplateForm } from "@/components/form/TemplateForm"
import { cn } from "@/lib/utils"

// 动态导入 ReactMarkdown，禁用 SSR
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
})

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  template?: { fields: Array<{ key: string; label: string; type: string }> }
  onTemplateSubmit?: (data: Record<string, string>) => void
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  template,
  onTemplateSubmit,
}) => {
  return (
    <div
      className={cn(
        "w-fit rounded-lg px-4 py-2 text-xs",
        role === "user"
          ? "ml-auto max-w-[80%] bg-primary text-primary-foreground"
          : "max-w-[80%] bg-muted/50",
      )}
    >
      {role === "user" ? (
        <div>{content}</div>
      ) : (
        <>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          {template && onTemplateSubmit && (
            <div className="mt-4">
              <TemplateForm
                template={template.fields}
                onSubmit={onTemplateSubmit}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
