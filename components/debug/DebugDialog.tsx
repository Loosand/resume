'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Bug } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useResumeStore } from '@/lib/store/resumeStore'
import { useChatStore } from '@/lib/store/chatStore'
import { JsonViewer } from '@/components/json/JsonViewer'

interface DebugDialogProps {
  gptResponse: string
}

export function DebugDialog({ gptResponse }: DebugDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const resumeMetadata = useResumeStore((state) => state.resumeMetadata)
  const resumeMarkdown = useResumeStore((state) => state.resumeMarkdown)
  const chatMessages = useChatStore((state) => state.messages)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bug className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-[90vw]">
        <DialogHeader>
          <DialogTitle>Debug Information</DialogTitle>
          <DialogDescription>
            View various debug information for the application
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="resume-metadata" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resume-metadata">Resume Metadata</TabsTrigger>
            <TabsTrigger value="resume-markdown">Resume Markdown</TabsTrigger>
            <TabsTrigger value="chat-history">Chat History</TabsTrigger>
            <TabsTrigger value="gpt-response">GPT Response</TabsTrigger>
          </TabsList>
          <TabsContent value="resume-metadata">
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
              <JsonViewer src={resumeMetadata} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="resume-markdown">
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
              <pre className="text-sm whitespace-pre-wrap">{resumeMarkdown}</pre>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="chat-history">
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
              <JsonViewer src={chatMessages} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="gpt-response">
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
              <pre className="text-sm whitespace-pre-wrap">{gptResponse}</pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

