"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, ArrowUpRight, Minus } from "lucide-react";

type UIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ApiHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatAssistantText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\r\n/g, "\n")
    .trim();
}

function renderFormattedContent(content: string) {
  const cleaned = formatAssistantText(content);
  const lines = cleaned.split("\n").filter((line) => line.trim() !== "");

  return lines.map((line, index) => {
    const isBullet = line.trim().startsWith("• ");

    if (isBullet) {
      const bulletText = line.replace(/^•\s*/, "");
      const parts = bulletText.split(/:(.+)/);

      if (parts.length > 1) {
        return (
          <div key={index} className="flex gap-2 leading-relaxed">
            <span className="shrink-0">•</span>
            <span>
              <strong className="font-semibold">{parts[0]}:</strong>
              <span> {parts[1].trim()}</span>
            </span>
          </div>
        );
      }

      return (
        <div key={index} className="flex gap-2 leading-relaxed">
          <span className="shrink-0">•</span>
          <span>{bulletText}</span>
        </div>
      );
    }

    return (
      <p key={index} className="leading-relaxed">
        {line}
      </p>
    );
  });
}

export default function StudioInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    const nextHeight = Math.min(textarea.scrollHeight, 220);
    textarea.style.height = `${nextHeight}px`;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, scrollToBottom]);

  useEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        abortRef.current?.abort();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
        resizeTextarea();
      }, 50);
    }
  }, [isOpen, resizeTextarea]);

  const buildHistoryForApi = useCallback((allMessages: UIMessage[]) => {
    return allMessages.map(
      (msg): ApiHistoryMessage => ({
        role: msg.role,
        content: msg.content,
      })
    );
  }, []);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    setIsOpen(false);
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: UIMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: trimmed,
          history: buildHistoryForApi(messages),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Something went wrong while contacting the assistant."
        );
      }

      const assistantText =
        typeof data?.text === "string" && data.text.trim()
          ? data.text.trim()
          : "I’m here. Ask me about my work, services, tech stack, or how to contact me.";

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: assistantText,
        },
      ]);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while contacting the assistant.";

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsSending(false);
      abortRef.current = null;
      setTimeout(() => {
        textareaRef.current?.focus();
        resizeTextarea();
      }, 0);
    }
  }, [input, isSending, messages, buildHistoryForApi, resizeTextarea]);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-[100] group flex items-center gap-3 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 md:gap-4"
        aria-label="Open chat"
      >
        <span className="hidden sm:block text-[10px] uppercase tracking-[0.4em] text-zinc-500 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
          Inquiry
        </span>
        <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-zinc-200 bg-white flex items-center justify-center shadow-sm hover:rotate-90 transition-transform duration-500">
          <Plus size={20} className="text-zinc-400" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-zinc-50/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 40 }}
              className="
                relative flex flex-col bg-white border border-zinc-100 overflow-hidden rounded-sm
                shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]
                h-[100dvh] w-full
                sm:h-[88vh] sm:max-h-[880px] sm:w-full sm:max-w-4xl
              "
              role="dialog"
              aria-modal="true"
              aria-label="Studio Conversation"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-50 sm:px-8 sm:py-7 md:px-12 md:py-10">
                <div className="space-y-1 min-w-0">
                  <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.35em] sm:tracking-[0.5em] text-zinc-400 font-medium">
                    Personal Assistant
                  </h2>
                  <p className="text-xl sm:text-2xl font-light text-zinc-900 tracking-tighter">
                    Studio Conversation
                  </p>
                </div>

                <div className="flex gap-4 sm:gap-6 md:gap-8 shrink-0">
                  <button
                    type="button"
                    className="text-zinc-300 hover:text-zinc-900 transition-colors"
                    aria-label="Minimize"
                  >
                    <Minus size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-zinc-300 hover:text-zinc-900 transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 py-6 space-y-10 sm:px-8 sm:py-8 sm:space-y-14 md:px-12 md:py-12 md:space-y-20 no-scrollbar"
              >
                {messages.length === 0 && (
                  <div className="max-w-md space-y-4 sm:space-y-6">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-light text-zinc-300 leading-[1.1] tracking-tighter">
                      How should we{" "}
                      <span className="italic font-serif text-zinc-900">
                        begin
                      </span>{" "}
                      our session today?
                    </p>
                    <div className="h-px w-12 bg-zinc-200" />
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`w-full max-w-[90%] sm:max-w-[80%] md:max-w-2xl ${
                        msg.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="block text-[9px] uppercase tracking-[0.3em] text-zinc-400 mb-3 sm:mb-4">
                        {msg.role === "user" ? "The Client" : "Studio"}
                      </span>

                      <div
                        className={`space-y-3 text-base sm:text-lg ${
                          msg.role === "assistant"
                            ? "font-serif italic text-zinc-800"
                            : "font-sans font-medium text-zinc-900"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          renderFormattedContent(msg.content)
                        ) : (
                          <p className="whitespace-pre-wrap break-words leading-relaxed">
                            {msg.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isSending && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-2xl text-left">
                      <span className="block text-[9px] uppercase tracking-[0.3em] text-zinc-400 mb-3 sm:mb-4">
                        Studio
                      </span>
                      <p className="font-serif italic text-zinc-500 text-base sm:text-lg leading-relaxed">
                        Writing…
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="px-5 py-5 border-t border-zinc-50 bg-white sm:px-8 sm:py-8 md:px-12 md:py-12">
                <div className="relative group flex items-end justify-between gap-4 sm:gap-6 md:gap-8">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Write your message here..."
                    className="flex-1 bg-transparent py-2 text-lg sm:text-xl font-light text-zinc-900 outline-none placeholder:text-zinc-200 resize-none max-h-[220px] min-h-[40px] overflow-y-auto"
                    disabled={isSending}
                    aria-label="Message input"
                  />

                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isSending}
                    className="group/btn flex items-center gap-2 sm:gap-3 text-zinc-400 hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shrink-0"
                    aria-label="Send message"
                  >
                    <span className="hidden sm:block text-[10px] uppercase tracking-[0.4em] font-bold">
                      {isSending ? "Sending" : "Send"}
                    </span>
                    <div className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-100 group-hover/btn:border-zinc-900 transition-colors">
                      <ArrowUpRight size={20} />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}