import { create } from "zustand"
import { type Message } from "ai"
import { persist, createJSONStorage } from "zustand/middleware"

interface ChatStore {
  messages: Message[]
  pendingMessage: Message | null
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  clearMessages: () => void
  setPendingMessage: (message: Message | null) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      pendingMessage: null,
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
          pendingMessage: null,
        })),
      setMessages: (messages) => set({ messages }),
      clearMessages: () => set({ messages: [] }),
      setPendingMessage: (message) => set({ pendingMessage: message }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      serialize: (state) => JSON.stringify(state),
      deserialize: (str) => JSON.parse(str),
    },
  ),
)
