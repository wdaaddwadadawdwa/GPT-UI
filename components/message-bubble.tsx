"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Pluggable } from "unified";
import { Bot, User } from "lucide-react";
import clsx from "clsx";
import { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";
  const highlightPlugin = rehypeHighlight as unknown as Pluggable;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={clsx(
        "flex w-full gap-4 rounded-2xl border border-surface-border/60 bg-surface/70 p-4 shadow-sm",
        isAssistant ? "border-l-emerald-500/60" : "border-l-sky-500/60"
      )}
    >
      <span
        className={clsx(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm",
          isAssistant
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
            : "border-sky-500/60 bg-sky-500/10 text-sky-200"
        )}
      >
        {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </span>
      <div className="flex-1">
        <div className="markdown-body text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[highlightPlugin]}
            components={{
              pre({ children, ...props }) {
                return (
                  <pre {...props} className="scrollbar-thin" suppressHydrationWarning>
                    {children}
                  </pre>
                );
              }
            }}
          >
            {message.content || (message.isStreaming ? "" : "")}
          </ReactMarkdown>
        </div>
        {message.isStreaming && (
          <motion.span
            className="mt-3 inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-emerald-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span>Generating</span>
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
