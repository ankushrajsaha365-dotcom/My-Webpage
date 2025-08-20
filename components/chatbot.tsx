"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Ankush's AI assistant. Ask me anything about his skills, projects, or experience!",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const botResponses = {
    skills:
      "Ankush is proficient in JavaScript, Python, React, Node.js, Machine Learning, TensorFlow, PyTorch, SQL, Git, and HTML/CSS. He's particularly passionate about AI/ML technologies!",
    projects:
      "Ankush has worked on several exciting projects including an AI Chat Assistant using Python and NLP, a full-stack E-commerce Website with React and Node.js, and a Data Visualization Dashboard with Python and Plotly.",
    experience:
      "Ankush is currently a 2nd-year B.Tech student at MCKV Institute of Engineering, specializing in AI & ML. He's actively building his experience through academic projects and is open to internships and collaborative opportunities.",
    education:
      "Ankush is pursuing B.Tech in Computer Science & Engineering with AI & ML specialization at MCKV Institute of Engineering.",
    contact:
      "You can reach Ankush at ankushrajsaha365@gmail.com or call him at 7003897566. He's also available on GitHub and LinkedIn!",
    default:
      "That's a great question! Ankush is passionate about technology and always eager to learn. Feel free to ask about his skills, projects, education, or how to contact him!",
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simple keyword-based response
    setTimeout(() => {
      let response = botResponses.default
      const input = inputValue.toLowerCase()

      if (input.includes("skill") || input.includes("technology") || input.includes("programming")) {
        response = botResponses.skills
      } else if (input.includes("project") || input.includes("work") || input.includes("build")) {
        response = botResponses.projects
      } else if (input.includes("experience") || input.includes("internship") || input.includes("job")) {
        response = botResponses.experience
      } else if (input.includes("education") || input.includes("study") || input.includes("college")) {
        response = botResponses.education
      } else if (input.includes("contact") || input.includes("email") || input.includes("phone")) {
        response = botResponses.contact
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        isBot: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 rounded-full p-4 gradient-bg pulse-glow shadow-lg hover:shadow-xl transition-all z-50"
        size="icon"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-24 left-8 w-80 h-96 shadow-2xl z-50 slide-in-right">
          <CardHeader className="gradient-bg text-white p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot size={20} />
              Chat with Ankush's AI
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  {message.isBot && (
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-2 rounded-lg text-sm ${
                      message.isBot ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.text}
                  </div>
                  {!message.isBot && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User size={12} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
