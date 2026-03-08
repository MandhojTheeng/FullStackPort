"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const quickQuestions = [
  "What projects have you built?",
  "What are your skills?",
  "How can I contact you?",
  "Tell me about your work",
];

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm Santosh's AI assistant. Ask me anything about him, and I'll help you out!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("project") || lowerQuestion.includes("built") || lowerQuestion.includes("work")) {
      return "Santosh has built several projects including:\n\n🛒 E-Commerce Platform\n📊 SaaS Dashboard\n💼 Portfolio Generator\n✅ Task Management App\n🌤️ Weather Application\n📝 Blog Platform\n\nWould you like to see any specific project details?";
    }
    
    if (lowerQuestion.includes("skill") || lowerQuestion.includes("tech") || lowerQuestion.includes("technology")) {
      return "Santosh works with:\n\n⚛️ React, Next.js\n📘 TypeScript\n🟢 Node.js\n🐍 Python\n🎨 Tailwind CSS\n🗄️ PostgreSQL, MongoDB\n☁️ AWS\n\nHe's a full-stack developer with expertise in both frontend and backend technologies.";
    }
    
    if (lowerQuestion.includes("contact") || lowerQuestion.includes("email") || lowerQuestion.includes("phone") || lowerQuestion.includes("reach")) {
      return "You can contact Santosh:\n\n📧 Email: timalsinasantosh19@gmail.com\n📱 Phone: +977 9843385766\n📍 Location: Kathmandu, Nepal\n\nHe's available for freelance work and full-time positions!";
    }
    
    if (lowerQuestion.includes("experience") || lowerQuestion.includes("year") || lowerQuestion.includes("background") || lowerQuestion.includes("work") || lowerQuestion.includes("job") || lowerQuestion.includes("company")) {
      return "Santosh's Background:\n\n💼 Current: Officer at Glocal Private Limited\n📅 Experience: 3+ Years\n✅ Projects: 20+ Completed\n😊 Clients: 10+ Happy Clients\n\nHe's a passionate Full Stack Developer & UI/UX Designer who loves building exceptional digital experiences.";
    }
    
    if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi") || lowerQuestion.includes("hey")) {
      return "Hello! 👋\n\nHow can I help you today? Feel free to ask about:\n- Santosh's projects\n- His skills\n- How to contact him\n- His work experience\n\nI'm here to help!";
    }
    
    return "That's a great question! Santosh is a passionate Full Stack Developer and UI/UX Designer currently working as an Officer at Glocal Private Limited. He loves building exceptional digital experiences. Would you like to know more about his projects or get in touch with him?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: getAIResponse(input),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with AI"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        
        {/* Pulse animation */}
        {!isOpen && (
          <span className="absolute w-full h-full rounded-full bg-blue-400 animate-ping opacity-75" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white border border-zinc-200 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-blue-100 text-xs">Ask me about Santosh</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/80 text-xs">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-zinc-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 whitespace-pre-line ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md"
                        : "bg-white border border-zinc-200 text-zinc-700 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-zinc-200 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-4 pb-2 bg-zinc-50 border-t border-zinc-100">
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3 py-1.5 text-xs bg-white border border-zinc-200 hover:border-blue-300 hover:text-blue-600 rounded-full text-zinc-600 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-zinc-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask something..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-full px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

