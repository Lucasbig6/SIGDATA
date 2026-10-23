"use client";

import { createContext, useContext } from "react";
import type { AnswerContent } from "@/lib/assistant-rules";

/** Estado das ações do chat (votos, salvamentos, criação de análises). */
export interface ChatContextValue {
  projectId: string;
  pending: boolean;
  selectedIds: string[];
  onToggleSource: (id: string) => void;
  votes: Record<string, "up" | "down">;
  savedIds: string[];
  creatingIds: string[];
  createdIds: string[];
  onVote: (messageId: string, vote: "up" | "down") => void;
  onSaveResults: (messageId: string, answer: AnswerContent) => void;
  onCreateAnalysis: (messageId: string, answer: AnswerContent) => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const value = useContext(ChatContext);
  if (!value) {
    throw new Error("useChatContext precisa estar dentro de ChatPanel");
  }
  return value;
}
