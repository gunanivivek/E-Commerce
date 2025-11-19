import { create } from "zustand";
import type { ChatMessage } from "../types/chatbot";

interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  toggleChat: () => void;
  addMessage: (msg: ChatMessage) => void;
  resetChat: () => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  isOpen: false,
  messages: [],
  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  resetChat: () => set({ messages: [] }),
}));
