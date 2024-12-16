"use client"

import React, { useState, useCallback } from "react"

import { ChatV2 } from "@/components/chat/ChatV2"
import { MetadataManager } from "@/components/form/MetadataManager"
import { useResumeStore } from "@/lib/store/resumeStore"

interface MdxClientPageProps {
  children: React.ReactNode
}

export function MdxClientPage({ children }: MdxClientPageProps) {
  const { resumeMetadata, updateResumeMetadata } = useResumeStore()
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
        <div className="w-1/2 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}
