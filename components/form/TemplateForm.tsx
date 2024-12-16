import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TemplateField {
  key: string
  label: string
  type: string
}

interface TemplateFormProps {
  template: TemplateField[]
  onSubmit: (data: Record<string, string>) => void
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {template.map((field) => (
        <div key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            type={field.type}
            value={formData[field.key] || ""}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            required
          />
        </div>
      ))}
      <Button type="submit">提交</Button>
    </form>
  )
}
