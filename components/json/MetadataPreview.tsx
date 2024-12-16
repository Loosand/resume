import { useEffect, useRef } from "react"

import { useResumeStore } from "@/lib/store/resumeStore"
import { Card } from "@/components/ui/card"

export function MetadataPreview() {
  const { resumeMetadata, pendingResumeMetadata } = useResumeStore()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [resumeMetadata, pendingResumeMetadata])

  return (
    <Card className="h-[calc(100vh-180px)] overflow-y-auto p-4">
      <div ref={containerRef} className="h-full overflow-y-auto">
        <pre className="whitespace-pre-wrap">
          {pendingResumeMetadata
            ? JSON.stringify(pendingResumeMetadata, null, 2)
            : JSON.stringify(resumeMetadata, null, 2)}
        </pre>
      </div>
    </Card>
  )
}
