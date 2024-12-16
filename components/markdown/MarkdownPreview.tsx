"use client"

import React, { useRef } from "react"
import ReactMarkdown from "react-markdown"
import { Download } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useResumeStore } from "@/lib/store/resumeStore"

interface MarkdownPreviewProps {
  isLoading: boolean
}

export function MarkdownPreview({ isLoading }: MarkdownPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { resumeMarkdown, pendingResumeMarkdown } = useResumeStore()

  const handleDownloadMD = () => {
    const blob = new Blob([resumeMarkdown || ""], {
      type: "text/markdown",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF()
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save("resume.pdf")
    }
  }

  const handleDownloadPNG = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current)
      const dataURL = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "resume.png"
      link.href = dataURL
      link.click()
    }
  }

  return (
    <Card className="mx-auto flex h-[calc(100vh-180px)] max-w-[800px] flex-col overflow-y-scroll">
      <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDownloadMD}>
              下载 Markdown (.md)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadPDF}>
              下载 PDF (.pdf)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadPNG}>
              下载图片 (.png)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div
          ref={contentRef}
          className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-h1:mb-4 prose-h1:text-2xl prose-h2:mb-3 prose-h2:text-xl prose-h3:mb-2 prose-h3:text-lg prose-p:mb-2 prose-p:leading-relaxed prose-a:text-blue-600 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-strong:font-semibold prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4 prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4 prose-li:my-1 prose-hr:my-4 prose-a:hover:underline dark:prose-a:text-blue-400 dark:prose-code:bg-gray-800"
        >
          <ReactMarkdown>
            {pendingResumeMarkdown
              ? pendingResumeMarkdown
              : resumeMarkdown || "您的简历将在这里显示..."}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}
