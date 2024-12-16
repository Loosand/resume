"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false })

interface JsonViewerProps {
  src: object
}

export function JsonViewer({ src }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(src, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="absolute right-2 top-2 z-10"
        onClick={handleCopy}
      >
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copied!" : "Copy"}
      </Button>
      <ReactJson
        src={src}
        theme="rjv-default"
        displayDataTypes={false}
        enableClipboard={false}
        collapsed={false}
        collapseStringsAfterLength={50}
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        }}
      />
    </div>
  )
}
