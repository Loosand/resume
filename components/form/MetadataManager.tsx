"use client"

import React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ResumeMetadata } from "@/types/resume"
import { useResumeStore } from "@/lib/store/resumeStore"

interface MetadataManagerProps {
  metadata: ResumeMetadata
  onUpdate: (updatedMetadata: Partial<ResumeMetadata>) => void
}

interface SectionDialogProps {
  section: string
  data: any
  onUpdate: (path: string[], value: any) => void
}

function SectionDialog({ section, data, onUpdate }: SectionDialogProps) {
  const renderField = (key: string, value: any, path: string[]) => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return (
        <Accordion type="multiple" className="w-full" key={key}>
          <AccordionItem value={key}>
            <AccordionTrigger className="text-left">
              <div>
                <span className="font-medium">{key}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {Object.keys(value).length} 个字段
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-2">
              {Object.entries(value).map(([subKey, subValue]) =>
                renderField(subKey, subValue, [...path, subKey]),
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    } else if (Array.isArray(value)) {
      return (
        <div className="space-y-2" key={key}>
          <Label htmlFor={path.join(".")}>
            {key}
            <span className="ml-2 text-sm text-muted-foreground">
              (数组，每行一个值)
            </span>
          </Label>
          <Textarea
            id={path.join(".")}
            value={value.join("\n")}
            onChange={(e) => onUpdate(path, e.target.value.split("\n"))}
            className="min-h-[100px]"
            placeholder={`请输入${key}的值...`}
          />
        </div>
      )
    } else {
      return (
        <div className="space-y-2" key={key}>
          <Label htmlFor={path.join(".")}>{key}</Label>
          <Input
            id={path.join(".")}
            value={value || ""}
            onChange={(e) => onUpdate(path, e.target.value)}
            placeholder={`请输入${key}的值...`}
          />
        </div>
      )
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group h-32 w-full space-y-2 p-4 hover:border-primary"
        >
          <div className="flex h-full w-full flex-col items-center justify-center">
            <span className="text-lg font-medium group-hover:text-primary">
              {section}
            </span>
            <span className="text-sm text-muted-foreground">
              {Object.keys(data).length} 个字段
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{section}</DialogTitle>
          <DialogDescription>编辑 {section} 的详细信息</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh] px-4">
          <Card className="p-6">
            <div className="space-y-4">
              {Object.entries(data).map(([key, value]) =>
                renderField(key, value, [section, key]),
              )}
            </div>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function MetadataManager({ metadata, onUpdate }: MetadataManagerProps) {
  const [localMetadata, setLocalMetadata] =
    React.useState<ResumeMetadata>(metadata)
  const updateResumeMetadata = useResumeStore(
    (state) => state.updateResumeMetadata,
  )

  const handleUpdate = (path: string[], value: any) => {
    setLocalMetadata((prev) => {
      const newMetadata = { ...prev }
      let current: any = newMetadata
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {}
        }
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newMetadata
    })
  }

  const handleSave = () => {
    onUpdate(localMetadata)
    updateResumeMetadata(localMetadata)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">管理元数据</Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[800px]">
        <DialogHeader>
          <DialogTitle>管理简历元数据</DialogTitle>
          <DialogDescription>
            在这里您可以查看和编辑简历的元数据。这些数据将用于生成最终的简历。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <ScrollArea className="h-[60vh] px-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(localMetadata).map(([section, data]) => (
                <SectionDialog
                  key={section}
                  section={section}
                  data={data}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end">
            <Button onClick={handleSave}>保存所有更改</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
