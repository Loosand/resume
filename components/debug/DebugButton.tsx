"use client"

import { useState } from "react"
import { Bug } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useResumeStore } from "@/lib/store/resumeStore"
import { JsonViewer } from "@/components/json/JsonViewer"

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
      <DialogContent className="w-[90vw] bg-gray-50 sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Resume Store Debug</DialogTitle>
          <DialogDescription>
            Current state of the resume metadata store
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md border bg-white p-4">
          <JsonViewer src={resumeMetadata} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
