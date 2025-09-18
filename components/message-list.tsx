"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChatMessage } from "@/lib/types";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex h-full flex-col space-y-4 px-6 py-6">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div key={message.id} layout>
            <MessageBubble message={message} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
