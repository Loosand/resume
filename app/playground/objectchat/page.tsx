// 'use client';
// 
// import { experimental_useObject as useObject } from 'ai/react';
// import { resumeSchema} from '@/app/api/chat/object/schema';
// 
// export default function Page() {
//   const { object, submit, isLoading, stop } = useObject({
//     api: '/api/chat/playground/object',
//     schema: resumeSchema,
//   });
//   
// 
//   return (
//     <div>
//       <button
//         onClick={() => submit('Messages during finals week.')}
//         disabled={isLoading}
//       >
//         Generate notifications
//       </button>
// 
//       {isLoading && (
//         <div>
//           <div>Loading...</div>
//           <button type="button" onClick={() => stop()}>
//             Stop
//           </button>
//         </div>
//       )}
//     
//     </div>
//   );
// }



import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

const { partialObjectStream } = streamObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});

for await (const partialObject of partialObjectStream) {
  console.clear();
  console.log(partialObject);
}