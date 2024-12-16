import React from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface FilePreviewProps {
  files: File[]
  onRemove: (index: number) => void
}

export const FilePreview: React.FC<FilePreviewProps> = ({ files, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center bg-muted rounded-md p-2">
          <span className="text-sm truncate max-w-[150px]">{file.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-2"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

