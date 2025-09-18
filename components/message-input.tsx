"use client";

import { FormEvent, useState } from "react";
import { CornerDownLeft, Paperclip } from "lucide-react";

interface MessageInputProps {
  disabled?: boolean;
  onSubmit: (value: string) => Promise<void> | void;
}

export function MessageInput({ disabled, onSubmit }: MessageInputProps) {
  const [value, setValue] = useState("");

  const sendMessage = async () => {
    if (!value.trim() || disabled) return;
    const trimmed = value.trim();
    setValue("");
    await onSubmit(trimmed);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await sendMessage();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center space-x-3 rounded-2xl border border-surface-border bg-surface/80 px-4 py-3 shadow-xl"
    >
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-gray-500 transition hover:border-gray-400 hover:text-gray-200"
        title="Attach (coming soon)"
        disabled
      >
        <Paperclip className="h-4 w-4" />
      </button>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Message ChatGPT"
        rows={1}
        className="max-h-36 flex-1 resize-none bg-transparent text-sm text-gray-100 outline-none placeholder:text-gray-500"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void sendMessage();
          }
        }}
      />
      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 text-emerald-200 transition hover:bg-emerald-500/20 disabled:border-surface-border disabled:bg-surface-border/40 disabled:text-gray-500"
      >
        <CornerDownLeft className="h-4 w-4" />
      </button>
    </form>
  );
}
