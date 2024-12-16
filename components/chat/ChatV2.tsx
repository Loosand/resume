"use client"

import {
  useChat,
  type Message,
  experimental_useObject as useObject,
} from "ai/react"
import { useState, useEffect, useRef } from "react"
import { nanoid } from "nanoid"
import { Wand2, UserSquare2, ChevronDown } from "lucide-react"

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

interface ChatProps {
  onUpdateResume: (content: Partial<ResumeMetadata>) => void
  onUpdateMarkdown: (markdown: string) => void
  onLoading: (loading: boolean) => void
}

export function ChatV2({
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
  const {
    updateResumeMetadata,
    updateResumeMarkdown,
    resumeMarkdown,
    setPendingResumeMarkdown,
    setPendingResumeMetadata,
  } = useResumeStore()
  const {
    messages,
    addMessage,
    pendingMessage,
    setPendingMessage,
    setMessages,
    clearMessages,
  } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    if (messages.length === 0) {
      setShowWelcome(true)
    } else {
      setShowWelcome(false)
    }
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent, showWelcome])

  const { object, submit, isLoading, stop } = useObject({
    api: "/api/chat/object",
    schema: resumeSchema,
    fetch: async () => {
      return fetch("/api/chat/object", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: input,
          messages: messages,
        }),
      })
    },
    onError: (error) => {
      // if (error.value.content) {
      //   setStreamingContent(error.value.content)
      // }
      console.error("Error fetching object:", error)
    },
    onFinish: (data) => {
      console.log(data)

      if (data?.object?.content) {
        addMessage({
          id: Date.now().toString(),
          role: "assistant",
          content: data.object.content,
        })
        updateResumeMarkdown(data.object.resumeMarkdown)
        updateResumeMetadata(
          data.object.resumeMetadata as Partial<ResumeMetadata>,
        )
        setStreamingContent("")
        setPendingResumeMarkdown(null)
        setPendingMessage(null)
        setDebugContent(JSON.stringify(data, null, 2))
      }
    },
  })

  const {
    messages: cardMessages,
    input: cardInput,
    handleInputChange: cardHandleInputChange,
    handleSubmit,
    isLoading: cardIsLoading,
    stop: cardStop,
    setMessages: cardSetMessages,
  } = useChat({
    api: "/api/chat/card",
    onFinish: (message) => {
      console.log(message)
    },
    onError: () => {},
    onResponse: (response) => {
      console.log(response)
    },
    body: {
      context: resumeMarkdown,
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
    if (object?.content) {
      setStreamingContent(object.content)
      setPendingMessage({
        id: nanoid(),
        role: "assistant",
        content: object.content,
      })
    }
    if (object?.resumeMetadata) {
      setPendingResumeMetadata(object.resumeMetadata as Partial<ResumeMetadata>)
    }

    if (object?.resumeMarkdown) {
      setPendingResumeMarkdown(object.resumeMarkdown)
    }
  }, [object])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      )
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        })
      }
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

      const currentInput = input
      setInput("")

      addMessage({
        id: Date.now().toString(),
        role: "user",
        content: currentInput,
      })

      let attachmentContents: string[] = []
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const content = await readFileContent(file)
          attachmentContents.push(`File: ${file.name}\nContent: ${content}`)
        }
      }

      const attachmentText = attachmentContents.join("\n\n")
      const messageWithAttachments = `${currentInput}\n\nCurrent Resume Markdown:\n${resumeMarkdown}\n\nAttachments:\n${attachmentText}`

      try {
        await submit(messageWithAttachments)
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

  const handlePolishResume = () => {
    const polishPrompt = `请帮我润色当前的简历内容，使其更专业、更有吸引力。以下是当前的简历内容：
  ${resumeMarkdown}
请从以下几个方面优化：
1. 使用更专业的措辞
2. 突出关键成就
3. 改善表达方式
4. 优化整体结构`
    setInput(polishPrompt)
    handleFormSubmit(new Event("submit") as any)
  }

  const welcomeMessage = `
# 欢迎使用交互式简历制作器！
我是您的 AI 助手，很高兴为您服务。我可以帮助您：

1. **创建专业的简历**
2. **优化简历内容**
3. **回答有关简历编写的问题**

请告诉我您想要如何开始？您可以直接输入简历的信息，或者询问我关于简历编写的建议。`

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    )

    const handleScroll = () => {
      if (scrollContainer) {
        const isNearBottom =
          scrollContainer.scrollHeight -
            scrollContainer.scrollTop -
            scrollContainer.clientHeight <
          100
        setShowScrollButton(!isNearBottom)
      }
    }

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
      return () => scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleClearChat}>
          清除聊天记录
        </Button>
      </div>
      <ScrollArea
        ref={scrollAreaRef}
        className="relative max-h-[calc(100vh-200px)] flex-1 overflow-y-auto pb-4 pr-4"
      >
        <div className="space-y-4">
          <div className="mx-auto space-y-3">
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
            {pendingMessage && (
              <ChatMessage
                key={pendingMessage.id}
                role={pendingMessage.role as "user" | "assistant"}
                content={pendingMessage.content}
              />
            )}
            {isLoading && streamingContent === "" && (
              <div className="max-w-[80%] animate-pulse rounded-lg bg-muted p-4">
                <div className="mb-2 h-4 w-3/4 rounded bg-muted-foreground/20"></div>
                <div className="h-4 w-1/2 rounded bg-muted-foreground/20"></div>
              </div>
            )}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-[60px] right-10 rounded-full bg-background/80 px-4 py-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:bg-background/90"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            )}
            <div ref={messagesEndRef} />
          </div>
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
        <div className="fixed bottom-20 right-8 z-50 flex flex-col gap-4">
          <Button
            className="rounded-full bg-purple-600 shadow-lg transition-all duration-200 hover:bg-purple-700 hover:shadow-xl"
            size="lg"
            disabled={isLoading || !resumeMarkdown}
          >
            <UserSquare2 className="mr-2 h-5 w-5" />
            生成名片
          </Button>
        </div>
        <div className="absolute bottom-4 right-4">
          <DebugDialog gptResponse={debugContent} />
        </div>
      </div>
    </div>
  )
}
