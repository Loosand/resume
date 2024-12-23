"use client"

import React from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DebugSheetProps {
  content: string
  children: React.ReactNode
}

export function DebugSheet({ content, children }: DebugSheetProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const formatJSON = (json: string) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2)
    } catch {
      return json
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-[800px] sm:max-w-[800px]">
        <SheetHeader>
          <SheetTitle>GPT Response Debug</SheetTitle>
          <SheetDescription>
            This sheet displays the raw JSON response from GPT for debugging
            purposes.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(100vh-120px)]">
          <pre className="whitespace-pre-wrap break-words text-sm">
            {formatJSON(content)}
          </pre>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
