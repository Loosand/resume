import { streamText } from "ai"

import { generateCardPrompt } from "@/lib/prompts/prompts"
import { openai } from "@/lib/ai/openai"

export const maxDuration = 300

export async function POST(req: Request) {
  const context = await req.json()

  const response = streamText({
    model: openai("gpt-4o-2024-08-06"),
    messages: [{ role: "user", content: context }],
    system: generateCardPrompt,
    temperature: 0.2,
  })

  return response.toTextStreamResponse()
}
