import { streamObject } from "ai"
import { z } from "zod"

import { openai } from "@/lib/ai/openai"

export const maxDuration = 60

export async function POST(req: Request) {
  const notificationSchema = z.object({
    notifications: z.array(
      z.object({
        name: z.string().describe("Name of a fictional person."),
        message: z.string().describe("Message. Do not use emojis or links."),
      }),
    ),
  })

  const context = await req.json()

  const result = streamObject({
    model: openai("gpt-4o-2024-08-06"),
    schema: notificationSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  })

  return result.toTextStreamResponse()
}
