"use client";

import { Message } from "@/lib/admin-types";

interface MessagesProps {
  messages: Message[];
  onDelete: (id: string) => Promise<void>;
}

export default function Messages({ messages, onDelete }: MessagesProps) {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">Messages</h1>
      
      {messages.length === 0 ? (
        <div className="bg-black border border-white/10 rounded-2xl p-8 lg:p-12 text-center">
          <svg className="w-12 lg:w-16 h-12 lg:h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-white/50">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-black border border-white/10 rounded-2xl p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-white">{msg.name}</h3>
                  <p className="text-sm text-white/50">{msg.email}</p>
                  <p className="text-xs text-white/30 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(msg.id)}
                  className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors self-start sm:self-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="mt-4 text-white/70 text-sm lg:text-base">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

