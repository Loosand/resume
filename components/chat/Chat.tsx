"use client"

import { useChat, type Message } from "ai/react"
import { useState, useEffect, useRef } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { config } from "@/config"
import { AIResponse, ResumeMetadata } from "@/types/resume"
import { DebugDialog } from "@/components/debug/DebugDialog"
import { useResumeStore } from "@/lib/store/resumeStore"
import { useChatStore } from "@/lib/store/chatStore"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatInput } from "@/components/chat/ChatInput"
import { Button } from "@/components/ui/button"

const cleanJsonString = (str: string): string => {
  return str.replace(/^\`\`\`json\s*/, "").replace(/\s*\`\`\`$/, "")
}

interface ChatProps {
  onUpdateResume: (content: Partial<ResumeMetadata>) => void
  onUpdateMarkdown: (markdown: string) => void
  onLoading: (loading: boolean) => void
}

export function Chat({
  onUpdateResume,
  onUpdateMarkdown,
  onLoading,
}: ChatProps) {
  const [streamingContent, setStreamingContent] = useState<string>("")
  const [debugContent, setDebugContent] = useState<string>("")
  const [showWelcome, setShowWelcome] = useState(true)
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

  useEffect(() => {
    if (storedMessages.length === 0) {
      setShowWelcome(true)
    } else {
      setShowWelcome(false)
    }
  }, [storedMessages])

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages: setChatMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: storedMessages,
    onFinish: (message) => {
      console.log("Chat onFinish - Raw message:", message)
      onLoading(false)
      setDebugContent(JSON.stringify(message.content, null, 2))
      let parsedContent: AIResponse
      try {
        const cleanedContent = cleanJsonString(message.content)
        parsedContent = JSON.parse(cleanedContent) as AIResponse
        console.log("Chat onFinish - Parsed content:", parsedContent)
      } catch (error) {
        console.warn(
          "Failed to parse assistant message as JSON, treating as plain text",
        )
        parsedContent = {
          content: message.content,
          resumeMetadata: {} as ResumeMetadata,
          resumeMarkdown: "",
        }
      }
      if (parsedContent.resumeMetadata) {
        updateResumeMetadata(parsedContent.resumeMetadata)
        onUpdateResume(parsedContent.resumeMetadata)
      }
      if (parsedContent.resumeMarkdown) {
        updateResumeMarkdown(parsedContent.resumeMarkdown)
        onUpdateMarkdown(parsedContent.resumeMarkdown)
      }
      setStreamingContent(parsedContent.content || message.content)
      if (parsedContent.template) {
        setCurrentTemplate(parsedContent.template)
      } else {
        setCurrentTemplate(null)
      }
      addMessage(message)
      setShowWelcome(false)
    },
    onError: () => {
      onLoading(false)
      setStreamingContent("")
    },
    onResponse: (response) => {
      console.log(response)
    },
    body: {
      baseUrl: config.apiBaseUrl,
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

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant") {
        try {
          const cleanedContent = cleanJsonString(lastMessage.content)
          const parsedContent = JSON.parse(cleanedContent) as AIResponse
          setStreamingContent(parsedContent.content || lastMessage.content)
          if (parsedContent.template) {
            setCurrentTemplate(parsedContent.template)
          } else {
            setCurrentTemplate(null)
          }
        } catch (error) {
          console.warn(
            "Failed to parse assistant message as JSON in useEffect, treating as plain text",
          )
          setStreamingContent(lastMessage.content)
          setCurrentTemplate(null)
        }
      }
    }
    scrollToBottom()
  }, [messages, streamingContent])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleFormSubmit = async (e: React.FormEvent, attachments?: File[]) => {
    e.preventDefault()
    if (!isLoading) {
      onLoading(true)
      setStreamingContent("")
      setShowWelcome(false)

      let attachmentContents: string[] = []
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const content = await readFileContent(file)
          attachmentContents.push(`File: ${file.name}\nContent: ${content}`)
        }
      }

      const attachmentText = attachmentContents.join("\n\n")
      const messageWithAttachments = `${input}\n\nCurrent Resume Markdown:\n${resumeMarkdown}\n\nAttachments:\n${attachmentText}`

      handleSubmit(e, { data: messageWithAttachments })
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
    setStreamingContent((prevContent) => {
      if (prevContent) {
        const lastMessage = {
          ...messages[messages.length - 1],
          content: prevContent,
        }
        addMessage(lastMessage)
      }
      return ""
    })
  }

  const handleTemplateSubmit = (data: Record<string, string>) => {
    const formattedData = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")
    handleSubmit(new Event("submit") as any, { data: formattedData })
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)
    adjustTextareaHeight(e.target as HTMLTextAreaElement)
  }

  const handleClearChat = () => {
    clearMessages()
    setMessages([])
    setShowWelcome(true)
    setChatMessages([])
  }

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
            <ChatMessage
              role="assistant"
              content={`# 欢迎使用交互式简历制作器！

我是您的 AI 助手，很高兴为您服务。我可以帮助您：

1. **创建专业的简历**
2. **优化简历内容**
3. **回答有关简历编写的问题**

请告诉我您想要如何开始？您可以直接输入您的信息，或者询问我关于简历编写的建议。`}
            />
          )}
          {messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={
                msg.role === "assistant" && index === messages.length - 1
                  ? streamingContent
                  : msg.content
              }
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
          onInputChange={handleTextareaChange}
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
