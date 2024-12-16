import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import { NextResponse } from "next/server"

import { resumeGuidancePrompt, testPrompt } from "@/lib/prompts/prompts"
import { openai } from "@/lib/ai/openai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
    system: resumeGuidancePrompt,
  })

  return result.toDataStreamResponse()
}
