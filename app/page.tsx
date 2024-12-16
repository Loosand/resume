"use client"

import { useState, useCallback } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatV2 } from "@/components/chat/ChatV2"
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview"
import { MetadataManager } from "@/components/form/MetadataManager"
import { useResumeStore } from "@/lib/store/resumeStore"
import { Card } from "@/components/ui/card"
import { MetadataPreview } from "@/components/json/MetadataPreview"

export default function Home() {
  const { resumeMetadata, pendingResumeMetadata, updateResumeMetadata } =
    useResumeStore()
  const [isLoading, setIsLoading] = useState(false)

  const updateMarkdown = useCallback((markdown: string) => {}, [])

  const handleLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold">交互式简历制作器</h1>
          <div className="flex items-center space-x-2">
            <MetadataManager
              metadata={resumeMetadata}
              onUpdate={updateResumeMetadata}
            />
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r p-4">
          <ChatV2
            onUpdateResume={updateResumeMetadata}
            onUpdateMarkdown={updateMarkdown}
            onLoading={handleLoading}
          />
        </div>
        <div className="flex w-1/2 flex-col">
          <Tabs defaultValue="markdown" className="flex flex-1 flex-col">
            <TabsList className="h-auto w-full justify-start rounded-none border-b p-0">
              <TabsTrigger
                value="markdown"
                className="rounded-none data-[state=active]:border-b-2"
              >
                Markdown 预览
              </TabsTrigger>
              <TabsTrigger
                value="metadata"
                className="rounded-none data-[state=active]:border-b-2"
              >
                元数据预览
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="markdown"
              className="mt-0 flex-1 overflow-y-scroll p-4"
            >
              <MarkdownPreview isLoading={isLoading} />
            </TabsContent>
            <TabsContent
              value="metadata"
              className="mt-0 flex-1 overflow-y-scroll p-4"
            >
              <MetadataPreview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
