"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChatSession } from "@/lib/types";

interface RenameSessionDialogProps {
  session: ChatSession | null;
  onClose: () => void;
  onRename: (sessionId: string, title: string) => void;
}

export function RenameSessionDialog({ session, onClose, onRename }: RenameSessionDialogProps) {
  const [title, setTitle] = useState(session?.title ?? "");

  useEffect(() => {
    if (session) {
      setTitle(session.title);
    }
  }, [session]);

  return (
    <Transition.Root show={Boolean(session)} as={Fragment} afterLeave={() => setTitle("")}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0 opacity-100 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 sm:scale-100"
              leaveTo="opacity-0 sm:translate-y-4 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl">
                <Dialog.Title className="text-lg font-semibold text-gray-100">
                  Rename conversation
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-400">
                  Give this chat a descriptive name so you can find it later.
                </p>
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!session) return;
                    const trimmed = title.trim();
                    if (!trimmed) return;
                    onRename(session.id, trimmed);
                    onClose();
                    setTitle("");
                  }}
                >
                  <div>
                    <input
                      type="text"
                      autoFocus
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="E.g. Build a marketing plan"
                      className="w-full rounded-xl border border-surface-border bg-surface-muted/60 px-4 py-3 text-sm text-gray-100 outline-none transition focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setTitle("");
                      }}
                      className="rounded-xl border border-transparent px-4 py-2 text-gray-400 transition hover:border-surface-border hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface DeleteSessionDialogProps {
  session: ChatSession | null;
  onClose: () => void;
  onDelete: (sessionId: string) => void;
}

export function DeleteSessionDialog({ session, onClose, onDelete }: DeleteSessionDialogProps) {
  return (
    <Transition.Root show={Boolean(session)} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0 opacity-100 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 sm:scale-100"
              leaveTo="opacity-0 sm:translate-y-4 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl">
                <Dialog.Title className="text-lg font-semibold text-gray-100">
                  Delete chat?
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-400">
                  This will remove <span className="text-gray-100">{session?.title}</span> and its
                  messages. This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end space-x-2 text-sm">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-transparent px-4 py-2 text-gray-400 transition hover:border-surface-border hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!session) return;
                      onDelete(session.id);
                      onClose();
                    }}
                    className="rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-2 font-semibold text-red-200 transition hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
