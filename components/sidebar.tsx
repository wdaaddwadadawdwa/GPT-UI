"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MessageSquare, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import { ChatSession } from "@/lib/types";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
  onRenameSession: (session: ChatSession) => void;
  onDeleteSession: (session: ChatSession) => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onRenameSession,
  onDeleteSession
}: SidebarProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-surface-border bg-surface-muted/60 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Chats
        </h2>
        <button
          type="button"
          onClick={onCreateSession}
          className="flex items-center rounded-lg border border-surface-border bg-surface px-2 py-1 text-xs font-medium text-gray-200 transition hover:border-emerald-500/70 hover:text-emerald-300"
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> New chat
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        {sessions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-surface-border bg-surface/60 px-3 py-4 text-center text-xs text-gray-400">
            Start a new conversation to see it listed here.
          </p>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={clsx(
                "group flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2 text-left transition",
                activeSessionId === session.id
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                  : "bg-surface/60 text-gray-200 hover:border-surface-border hover:bg-surface"
              )}
            >
              <div className="flex items-center space-x-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-muted/80 text-gray-300 transition group-hover:border-emerald-500/50 group-hover:text-emerald-200">
                  <MessageSquare className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="truncate text-sm font-medium">{session.title}</p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Menu as="div" className="relative">
                <Menu.Button className="rounded-md p-1 text-gray-400 transition hover:bg-surface-border/40 hover:text-gray-200">
                  <MoreVertical className="h-4 w-4" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute right-0 z-20 mt-2 w-40 origin-top-right overflow-hidden rounded-lg border border-surface-border bg-surface-muted/90 p-1 text-sm shadow-xl backdrop-blur">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onRenameSession(session);
                          }}
                          className={clsx(
                            "flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left text-xs transition",
                            active
                              ? "bg-emerald-500/20 text-emerald-200"
                              : "text-gray-200 hover:bg-surface border border-transparent hover:border-surface-border"
                          )}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Rename</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteSession(session);
                          }}
                          className={clsx(
                            "flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left text-xs transition",
                            active
                              ? "bg-red-500/20 text-red-200"
                              : "text-red-300 hover:bg-red-500/10"
                          )}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </button>
          ))
        )}
      </nav>
    </aside>
  );
}
