"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ChatRole = "user" | "assistant";

interface UIMessage {
  id: number;
  role: ChatRole;
  content: string;
  timestamp: string;
}

interface ApiHistoryMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const quickPrompts = [
    "Tell me about yourself",
    "What is your experience?",
    "What services do you offer?",
    "How can I contact you?",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-chat-messages");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as UIMessage[];
      if (Array.isArray(parsed)) {
        setMessages(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio-chat-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => textareaRef.current?.focus(), 120);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const buildApiHistory = (items: UIMessage[]): ApiHistoryMessage[] => {
    return items.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
    setIsTyping(false);
    localStorage.removeItem("portfolio-chat-messages");
  };

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {}
  };

  const sendMessage = async (preset?: string) => {
    const value = (preset ?? input).trim();
    if (!value || isTyping) return;

    const currentMessages = [...messages];

    const userMessage: UIMessage = {
      id: generateId(),
      role: "user",
      content: value,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: value,
          history: buildApiHistory(currentMessages),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || data?.text || `Request failed with status ${response.status}`
        );
      }

      const assistantMessage: UIMessage = {
        id: generateId(),
        role: "assistant",
        content:
          typeof data?.text === "string" && data.text.trim()
            ? data.text
            : "Sorry, I could not generate a response.",
        timestamp: formatTime(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong while generating the response.",
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-[120] flex h-16 items-center gap-3 rounded-full border border-white/15 bg-black/85 px-3 pr-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 hover:border-white/25 hover:bg-black"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5">
          <span className="text-sm font-semibold tracking-wide text-white">AI</span>
        </span>

        <span className="flex flex-col items-start leading-none">
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/40">
            Assistant
          </span>
          <span className="mt-1 text-sm font-semibold text-white/90">
            {isOpen ? "Close chat" : "Ask me anything"}
          </span>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[110] bg-black/45 backdrop-blur-[8px]"
            />

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="fixed bottom-6 right-6 z-[130] flex h-[min(82vh,760px)] w-[calc(100vw-24px)] max-w-[420px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-black/90 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-3xl"
            >
              <div className="relative border-b border-white/10 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <span className="text-sm font-semibold text-white">AI</span>
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">
                        Portfolio Assistant
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-white/45">
                        <span className="h-2 w-2 rounded-full bg-white/70" />
                        <span className="truncate">
                          Projects, services, stack, contact
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClear}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/65 transition hover:bg-white/10 hover:text-white"
                    >
                      Clear
                    </button>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative border-b border-white/10 px-4 py-3">
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      disabled={isTyping}
                      className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[11px] text-white/70 backdrop-blur-xl transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin] [scrollbar-color:#2b2b2b_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="max-w-[280px] text-center">
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-white/5">
                        <span className="text-base font-semibold text-white">AI</span>
                      </div>

                      <h3 className="text-lg font-semibold text-white">
                        Clean, minimal, modern
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/45">
                        Ask about my work, experience, services, tech stack, or
                        contact details.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`group relative max-w-[88%] overflow-hidden rounded-[24px] px-4 py-3.5 ${
                            msg.role === "user"
                              ? "border border-white/10 bg-white text-black shadow-[0_12px_35px_rgba(255,255,255,0.08)]"
                              : "border border-white/10 bg-white/5 text-white backdrop-blur-xl"
                          }`}
                        >
                          <div className="relative whitespace-pre-wrap break-words text-[14px] leading-6">
                            {msg.content}
                          </div>

                          <div
                            className={`relative mt-3 flex items-center justify-between gap-4 text-[10px] ${
                              msg.role === "user"
                                ? "text-black/45"
                                : "text-white/38"
                            }`}
                          >
                            <span>{msg.timestamp}</span>

                            <button
                              onClick={() => handleCopy(msg.content, msg.id)}
                              className={`opacity-0 transition group-hover:opacity-100 ${
                                msg.role === "user"
                                  ? "hover:text-black"
                                  : "hover:text-white"
                              }`}
                            >
                              {copiedId === msg.id ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-white/55">Thinking</span>
                            <div className="flex gap-1.5">
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.3s]" />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.15s]" />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="relative border-t border-white/10 px-4 py-4">
                <div className="rounded-[26px] border border-white/10 bg-white/5 p-2.5 backdrop-blur-2xl">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask something..."
                    className="max-h-[120px] min-h-[24px] w-full resize-none bg-transparent px-2 py-2 text-[14px] leading-6 text-white outline-none placeholder:text-white/30"
                  />

                  <div className="mt-2 flex items-center justify-between gap-3 px-2">
                    <div className="text-[10px] text-white/28">
                      Enter to send
                    </div>

                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isTyping}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white px-4 text-[12px] font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}