"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { DeleteSessionDialog, RenameSessionDialog } from "@/components/session-dialogs";
import { ChatMessage, ChatSession } from "@/lib/types";
import { createId } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const STORAGE_KEY = "gpt-ui-sessions";

type NullableSession = ChatSession | null;

const defaultPrompts = [
  "Summarise the latest AI research trends",
  "Brainstorm marketing copy for a fintech app",
  "Explain recursion to a 5 year old",
  "Draft a learning plan for mastering TypeScript"
];

function createSession(title?: string): ChatSession {
  return {
    id: createId(),
    title: title ?? "New chat",
    createdAt: new Date().toISOString(),
    messages: []
  };
}

function buildAssistantResponse(prompt: string): string {
  return (
    `Sure! Here's a thoughtful answer to **"${prompt}"**:\n\n` +
    "1. **Key Insight** — " +
    `${prompt} is best approached by breaking the problem into smaller, testable pieces.\n` +
    "2. **Why it matters** — Understanding the intent behind the request helps tailor the solution.\n" +
    "3. **Next steps** — Start with a quick outline, iterate collaboratively, and refine with feedback.\n\n" +
    "```ts\n" +
    "// Bonus: tiny helper illustrating the concept\n" +
    "export function remember(topic: string) {\n" +
    `  return \`Let's learn about ${prompt.toLowerCase()}\`;\n` +
    "}\n" +
    "```\n\n" +
    "Let me know if you'd like examples or a deeper dive!"
  );
}

export default function HomePage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [renameTarget, setRenameTarget] = useState<NullableSession>(null);
  const [deleteTarget, setDeleteTarget] = useState<NullableSession>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: ChatSession[] = JSON.parse(stored);
        setSessions(parsed);
        setActiveSessionId(parsed[0]?.id ?? null);
      } catch (error) {
        console.error("Failed to parse stored sessions", error);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions, isHydrated]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [activeSession?.messages.length]);

  const upsertSessionMessages = useCallback(
    (sessionId: string, mapper: (messages: ChatMessage[]) => ChatMessage[]) => {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: mapper(session.messages)
              }
            : session
        )
      );
    },
    []
  );

  const handleCreateSession = useCallback(() => {
    const session = createSession(`Chat ${sessions.length + 1}`);
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
  }, [sessions.length]);

  const handleSelectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const handleRenameSession = useCallback((sessionId: string, title: string) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, title } : session))
    );
  }, []);

  const handleDeleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => {
      const next = prev.filter((session) => session.id !== sessionId);
      setActiveSessionId((current) => {
        if (current === sessionId) {
          return next[0]?.id ?? null;
        }
        return current;
      });
      return next;
    });
  }, []);

  const streamAssistantMessage = useCallback(
    async (sessionId: string, messageId: string, prompt: string) => {
      setIsStreaming(true);
      const fullResponse = buildAssistantResponse(prompt);
      const tokens = fullResponse.split(/(?<=\s)/);
      for (const token of tokens) {
        await new Promise((resolve) => setTimeout(resolve, 35 + Math.random() * 85));
        upsertSessionMessages(sessionId, (messages) =>
          messages.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  content: message.content + token
                }
              : message
          )
        );
      }
      upsertSessionMessages(sessionId, (messages) =>
        messages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                isStreaming: false
              }
            : message
        )
      );
      setIsStreaming(false);
    },
    [upsertSessionMessages]
  );

  const handleSendMessage = useCallback(
    async (value: string) => {
      let targetSessionId = activeSessionId;
      let createdSession: ChatSession | null = null;

      if (!targetSessionId) {
        createdSession = createSession(`Chat ${sessions.length + 1}`);
        targetSessionId = createdSession.id;
      }

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content: value,
        createdAt: new Date().toISOString()
      };

      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        isStreaming: true
      };

      setSessions((prev) => {
        const ensureSession = createdSession ? [createdSession, ...prev] : prev;
        return ensureSession.map((session) =>
          session.id === targetSessionId
            ? {
                ...session,
                messages: [...session.messages, userMessage, assistantMessage]
              }
            : session
        );
      });
      setActiveSessionId(targetSessionId);

      void streamAssistantMessage(targetSessionId, assistantMessage.id, value);
    },
    [activeSessionId, sessions.length, streamAssistantMessage]
  );

  return (
    <div className="flex h-screen w-full bg-surface">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateSession}
        onRenameSession={setRenameTarget}
        onDeleteSession={setDeleteTarget}
      />
      <main className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-surface-border bg-surface/70 px-6 backdrop-blur">
          <div>
            <h1 className="text-base font-semibold text-gray-100">
              {activeSession?.title ?? "Start chatting"}
            </h1>
            <p className="text-xs text-gray-500">
              Powered by streaming responses and markdown rendering
            </p>
          </div>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            {activeSession && activeSession.messages.length > 0 ? (
              <MessageList messages={activeSession.messages} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-6 text-center text-gray-400">
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  animate={{ rotate: [0, -4, 4, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-7 w-7" />
                </motion.div>
                <div className="max-w-sm space-y-2">
                  <h2 className="text-xl font-semibold text-gray-100">How can I help you today?</h2>
                  <p className="text-sm text-gray-400">
                    Start a new conversation or pick one of your recent chats from the left sidebar.
                  </p>
                </div>
                <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                  {defaultPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      className="rounded-2xl border border-surface-border bg-surface/80 px-4 py-3 text-left text-sm text-gray-200 transition hover:border-emerald-500/50 hover:bg-surface"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-surface-border bg-surface/80 p-6">
            <div className="mx-auto max-w-3xl">
              <MessageInput disabled={isStreaming} onSubmit={handleSendMessage} />
              <p className="mt-3 text-center text-[11px] text-gray-500">
                GPT UI recreates the familiar ChatGPT experience with markdown, syntax highlighting, and streaming replies.
              </p>
            </div>
          </div>
        </div>
      </main>
      <RenameSessionDialog
        session={renameTarget}
        onClose={() => setRenameTarget(null)}
        onRename={handleRenameSession}
      />
      <DeleteSessionDialog
        session={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDeleteSession}
      />
    </div>
  );
}
