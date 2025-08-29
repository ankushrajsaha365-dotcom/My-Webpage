"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  reactions?: string[]
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm Ankush's AI assistant. Ask me anything about his skills, projects, experience! I can help with business inquiries, technical questions, or general information.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"online" | "connecting" | "offline">("online")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const suggestedQuestions = [
    "What are Ankush's main skills?",
    "Can he build a website for my business?",
    "What's his availability for projects?",
    "Show me his recent projects",
    "What are his rates for web development?",
    "How can I contact him?",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setConversationContext((prev) => [...prev.slice(-4), input.trim()]) // Keep last 5 messages for context
    setInput("")
    setIsLoading(true)
    setIsTyping(true)
    setShowSuggestions(false)
    setConnectionStatus("connecting")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          context: conversationContext, // Send conversation context
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`)
      }

      const data = await response.json()
      setConnectionStatus("online")

      const typingDelay = Math.min(Math.max(data.message.length * 30, 1000), 3000)

      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message || "I'm sorry, I couldn't process that request.",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      }, typingDelay)
    } catch (error) {
      console.error("Chat error:", error)
      setConnectionStatus("offline")
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm having trouble connecting right now, but I'm still here to help! Try asking about Ankush's skills, projects, or contact information.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        setIsTyping(false)
        setConnectionStatus("online")
      }, 1500)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    setShowSuggestions(false)
    setTimeout(() => {
      formRef.current?.requestSubmit()
    }, 100)
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "online":
        return "bg-green-400"
      case "connecting":
        return "bg-yellow-400 animate-pulse"
      case "offline":
        return "bg-red-400"
      default:
        return "bg-green-400"
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "online":
        return "Online"
      case "connecting":
        return "Connecting..."
      case "offline":
        return "Reconnecting..."
      default:
        return "Online"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      <div className="fixed bottom-8 left-8 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative rounded-full p-4 gradient-bg pulse-glow shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
          size="icon"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          {!isOpen && <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor()} rounded-full`}></div>}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
        </Button>
      </div>

      {isOpen && (
        <Card
          className={`fixed bottom-24 left-8 shadow-2xl z-50 border-0 overflow-hidden transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
          } slide-in-right`}
        >
          <CardHeader
            className="gradient-bg text-white p-4 border-b-0 cursor-pointer"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot size={20} />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor()} rounded-full border-2 border-white`}
                  ></div>
                </div>
                <div>
                  <div className="font-semibold">Ankush's AI Assistant</div>
                  <div className="text-xs text-white/80">{getStatusText()} • AI-Powered</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMinimized(!isMinimized)
                  }}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(false)
                  }}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-full bg-gradient-to-b from-background via-background/95 to-muted/30">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {showSuggestions && messages.length === 1 && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-sm text-muted-foreground text-center">Try asking:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {suggestedQuestions.slice(0, 4).map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="text-left p-2 text-sm bg-white/50 hover:bg-white/80 rounded-lg border border-muted/50 transition-all hover:shadow-sm"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.role === "assistant" ? "justify-start" : "justify-end"} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/20">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[75%]">
                      <div
                        className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm transition-all hover:shadow-md ${
                          message.role === "assistant"
                            ? "bg-white/90 border border-muted text-foreground rounded-tl-sm"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-sm"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div
                        className={`text-xs text-muted-foreground mt-1 ${message.role === "user" ? "text-right" : "text-left"}`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/20">
                        <User size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-3 justify-start animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/20">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-white/90 border border-muted p-3 rounded-2xl rounded-tl-sm shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
                <form ref={formRef} onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about skills, projects, availability, pricing..."
                      className="rounded-full border-2 focus:border-primary/50 transition-all pr-12 bg-white/80 backdrop-blur-sm"
                      disabled={isLoading}
                      maxLength={500}
                      aria-label="Type your message"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                      {input.length}/500
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full gradient-bg hover:scale-105 transition-all shadow-lg ring-2 ring-white/20 hover:ring-white/40"
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </Button>
                </form>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted-foreground">Powered by AI • {messages.length - 1} messages</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className={`w-2 h-2 ${getStatusColor()} rounded-full`}></div>
                    <span>{getStatusText()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}
