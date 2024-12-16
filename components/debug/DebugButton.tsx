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
import { useResumeStore } from '@/lib/store/resumeStore'
import { JsonViewer } from '@/components/json/JsonViewer'

export function DebugButton() {
  const [isOpen, setIsOpen] = useState(false)
  const resumeMetadata = useResumeStore((state) => state.resumeMetadata)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bug className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-[90vw] bg-gray-50">
        <DialogHeader>
          <DialogTitle>Resume Store Debug</DialogTitle>
          <DialogDescription>
            Current state of the resume metadata store
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md border p-4 bg-white">
          <JsonViewer src={resumeMetadata} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

