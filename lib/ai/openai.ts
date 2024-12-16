import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
  baseURL: 'https://ganjiuwanshi.com/v1',
  apiKey: process.env.OPENAI_API_KEY,
});
