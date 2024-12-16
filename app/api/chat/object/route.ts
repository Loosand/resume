import { streamObject } from "ai"

import { resumeSchema } from "./schema"

import { resumeGuidancePrompt } from "@/lib/prompts/prompts"
import { openai } from "@/lib/ai/openai"

export const maxDuration = 300

export async function POST(req: Request) {
  try {
    const { context, messages } = await req.json()

    const timeoutDuration = 15000 // 15秒超时
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("请求超时")), timeoutDuration)
    })

    const streamPromise = streamObject({
      model: openai("gpt-4o-2024-08-06", {
        structuredOutputs: true,
      }),
      messages: [...messages, { role: "user", content: context }],
      schema: resumeSchema,
      system: resumeGuidancePrompt,
      mode: "json",
      temperature: 0.2,
    })

    const response = (await Promise.race([
      streamPromise,
      timeoutPromise,
    ])) as Awaited<typeof streamPromise>
    return response.toTextStreamResponse()
  } catch (error: unknown) {
    console.error("Stream error:", error)
    const errorMessage =
      error instanceof Error && error.message === "请求超时"
        ? "请求超时，请稍后重试"
        : "处理请求时发生错误"

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.message : "未知错误",
      }),
      {
        status:
          error instanceof Error && error.message === "请求超时" ? 504 : 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
