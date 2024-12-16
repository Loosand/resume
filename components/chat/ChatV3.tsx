"use client"

import {
  useChat,
  type Message,
  experimental_useObject as useObject,
} from "ai/react"
import { useState, useEffect, useRef } from "react"
import { useRequest } from "ahooks"
import { streamObject } from "ai"

import { ScrollArea } from "@/components/ui/scroll-area"
import { config } from "@/config"
import { AIResponse, ResumeMetadata } from "@/types/resume"
import { DebugDialog } from "@/components/debug/DebugDialog"
import { useResumeStore } from "@/lib/store/resumeStore"
import { useChatStore } from "@/lib/store/chatStore"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatInput } from "@/components/chat/ChatInput"
import { Button } from "@/components/ui/button"
import { resumeSchema } from "@/app/api/chat/object/schema"
import { openai } from "@/lib/ai/openai"
import { resumeGuidancePrompt } from "@/lib/prompts/prompts"

interface ChatProps {
  onUpdateResume: (content: Partial<ResumeMetadata>) => void
  onUpdateMarkdown: (markdown: string) => void
  onLoading: (loading: boolean) => void
}

export function ChatV3({
  onUpdateResume,
  onUpdateMarkdown,
  onLoading,
}: ChatProps) {
  const [streamingContent, setStreamingContent] = useState<string>("")
  const [debugContent, setDebugContent] = useState<string>("")
  const [showWelcome, setShowWelcome] = useState(true)
  const [input, setInput] = useState<string>("")
  const [currentTemplate, setCurrentTemplate] = useState<{
    fields: Array<{ key: string; label: string; type: string }>
  } | null>(null)
  const { updateResumeMetadata, updateResumeMarkdown, resumeMarkdown } =
    useResumeStore()
  const {
    messages: storedMessages,
    addMessage,
    setMessages,
    clearMessages,
  } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const messages = storedMessages

  useEffect(() => {
    if (storedMessages.length === 0) {
      setShowWelcome(true)
    } else {
      setShowWelcome(false)
    }
  }, [storedMessages])

  const fetchGPT = async (context: string) => {
    try {
      const response = await fetch("/api/chat/object", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(context),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response
    } catch (error) {
      console.error("Error fetching GPT response:", error)
      throw error
    }
  }

  const { data, error, run } = useRequest(fetchGPT, {
    manual: true,
    onSuccess: (data: any) => {
      console.log(data)
      if (data?.object?.content) {
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: data.object.content,
        })
        updateResumeMarkdown(data.object.resumeMarkdown)
        updateResumeMetadata(data.object.resumeMetadata)
        setStreamingContent("")
        setDebugContent(JSON.stringify(data, null, 2))
      }
    },
  })

  console.log(data)

  const { object, submit, isLoading, stop } = useObject({
    api: "/api/chat/object",
    schema: resumeSchema,
    onFinish: (data) => {
      if (data?.object?.content) {
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: data.object.content,
        })
        updateResumeMarkdown(data.object.resumeMarkdown)
        updateResumeMetadata(data.object.resumeMetadata)
        setStreamingContent("")
        setDebugContent(JSON.stringify(data, null, 2))
      }
    },
  })

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto"
    element.style.height = element.scrollHeight + "px"
  }

  useEffect(() => {
    const textarea = document.querySelector("textarea")
    if (textarea) {
      textarea.addEventListener("input", () =>
        adjustTextareaHeight(textarea as HTMLTextAreaElement),
      )
      adjustTextareaHeight(textarea as HTMLTextAreaElement)
    }
    return () => {
      if (textarea) {
        textarea.removeEventListener("input", () =>
          adjustTextareaHeight(textarea as HTMLTextAreaElement),
        )
      }
    }
  }, [])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const renderMessageContent = (msg: Message, index: number) => {
    if (
      msg.role === "assistant" &&
      index === messages.length - 1 &&
      isLoading
    ) {
      return streamingContent
    }
    return msg.content
  }

  const handleFormSubmit = async (e: React.FormEvent, attachments?: File[]) => {
    e.preventDefault()
    if (!isLoading) {
      onLoading(true)
      setStreamingContent("")
      setShowWelcome(false)

      addMessage({
        id: Date.now().toString(),
        role: "user",
        content: input,
      })

      let attachmentContents: string[] = []
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const content = await readFileContent(file)
          attachmentContents.push(`File: ${file.name}\nContent: ${content}`)
        }
      }

      const attachmentText = attachmentContents.join("\n\n")
      const messageWithAttachments = `${input}\n\nCurrent Resume Markdown:\n${resumeMarkdown}\n\nAttachments:\n${attachmentText}`

      try {
        await run(messageWithAttachments)
        setInput("")
      } catch (error) {
        console.error("Error submitting message:", error)
      } finally {
        onLoading(false)
      }
    }
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    })
  }

  const handleStop = () => {
    stop()
    onLoading(false)
  }

  const handleTemplateSubmit = (data: Record<string, string>) => {
    const formattedData = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustTextareaHeight(e.target as HTMLTextAreaElement)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    handleTextareaChange(e)
  }

  const handleClearChat = () => {
    clearMessages()
    setMessages([])
    setShowWelcome(true)
  }

  const welcomeMessage = `
# 欢迎使用交互式简历制作器！
我是您的 AI 助手，很高兴为您服务。我可以帮助您：

1. **创建专业的简历**
2. **优化简历内容**
3. **回答有关简历编写的问题**

请告诉我您想要如何开始？您可以直接输入您的信息，或者询问我关于简历编写的建议。`

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleClearChat}>
          清除聊天记录
        </Button>
      </div>
      <ScrollArea className="flex-1 pb-4 pr-4">
        <div className="space-y-4">
          {showWelcome && (
            <ChatMessage role="assistant" content={welcomeMessage} />
          )}
          {messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={renderMessageContent(msg, index)}
              template={currentTemplate || undefined}
              onTemplateSubmit={handleTemplateSubmit}
            />
          ))}
          {isLoading && streamingContent === "" && (
            <div className="max-w-[80%] animate-pulse rounded-lg bg-muted p-4">
              <div className="mb-2 h-4 w-3/4 rounded bg-muted-foreground/20"></div>
              <div className="h-4 w-1/2 rounded bg-muted-foreground/20"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="pb-2 pt-4">
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleFormSubmit}
          onStop={handleStop}
        />
        <div className="absolute bottom-4 right-4">
          <DebugDialog gptResponse={debugContent} />
        </div>
      </div>
    </div>
  )
}
