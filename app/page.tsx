"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, Phone, ChevronUp, Menu, X } from "lucide-react"
import Chatbot from "@/components/chatbot"

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "fallback">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const skills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Machine Learning",
    "TensorFlow",
    "PyTorch",
    "SQL",
    "Git",
    "HTML/CSS",
  ]

  const projects = [
    {
      title: "AI Chat Assistant",
      description: "Built an intelligent chatbot using Python and NLP libraries",
      tech: "Python, TensorFlow, Flask",
    },
    {
      title: "E-commerce Website",
      description: "Full-stack web application with user authentication and payment integration",
      tech: "React, Node.js, MongoDB",
    },
    {
      title: "Data Visualization Dashboard",
      description: "Interactive dashboard for analyzing and visualizing large datasets",
      tech: "Python, Pandas, Plotly",
    },
  ]

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)

    // basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error")
      setErrorMsg("Please fill in your name, email, and message.")
      return
    }

    try {
      setStatus("sending")
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      // Try to parse JSON (may fail if server not reachable)
      let data: any = null
      try {
        data = await res.json()
      } catch {
        // ignore parse error, handle by status
      }

      if (res.ok && data?.ok) {
        setStatus("success")
        setForm({ name: "", email: "", subject: "", message: "" })
        return
      }

      // 503 with fallback mailto
      if (res.status === 503 && data?.fallback?.mailto) {
        setStatus("fallback")
        // Open mail client with prefilled details
        window.location.href = data.fallback.mailto
        return
      }

      setStatus("error")
      setErrorMsg(data?.error || `Failed to send your message. Please try again.`)
    } catch (err: any) {
      setStatus("error")
      setErrorMsg("Network error. Please check your connection and try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 gradient-bg text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-sans font-bold text-xl float-animation">HireACoder</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="hover:text-yellow-300 transition-all duration-300 hover:scale-110">
                About
              </a>
              <a href="#skills" className="hover:text-yellow-300 transition-all duration-300 hover:scale-110">
                Skills
              </a>
              <a href="#projects" className="hover:text-yellow-300 transition-all duration-300 hover:scale-110">
                Projects
              </a>
              <a href="#experience" className="hover:text-yellow-300 transition-all duration-300 hover:scale-110">
                Experience
              </a>
              <a href="#achievements" className="hover:text-yellow-300 transition-all duration-300 hover:scale-110">
                Achievements
              </a>
              <a href="#contact" className="hover:text-yellow-300 transition-all duration-300 hover:scale-110">
                Contact
              </a>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden bounce-in" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 slide-in-right">
              <div className="flex flex-col space-y-2">
                <a
                  href="#about"
                  className="hover:text-yellow-300 transition-all duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="#skills"
                  className="hover:text-yellow-300 transition-all duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Skills
                </a>
                <a
                  href="#projects"
                  className="hover:text-yellow-300 transition-all duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Projects
                </a>
                <a
                  href="#experience"
                  className="hover:text-yellow-300 transition-all duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Experience
                </a>
                <a
                  href="#achievements"
                  className="hover:text-yellow-300 transition-all duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Achievements
                </a>
                <a
                  href="#contact"
                  className="hover:text-yellow-300 transition-all duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-sans text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in float-animation">
            Hi, I'm <span className="text-white">Ankush Raj Saha</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-delay">
            2nd-year B.Tech student in Computer Science & Engineering (AI & ML specialization)
          </p>
          <p className="font-serif text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Passionate about software development and AI/ML, currently studying at MCKV Institute of Engineering. I love
            building innovative solutions and exploring the endless possibilities of technology.
          </p>
          <Button
            size="lg"
            className="animate-fade-in-delay-2 hover:scale-110 transition-all duration-300 bg-white text-primary hover:bg-white/90"
          >
            <a href="#projects">View My Projects</a>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">About Me</h2>
          <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-500 pulse-glow">
            <CardContent className="p-8">
              <p className="font-serif text-lg text-foreground leading-relaxed">
                I'm a dedicated Computer Science student with a specialization in AI & ML at MCKV Institute of
                Engineering. My journey in technology is driven by curiosity and a passion for creating solutions that
                make a difference. I enjoy working on projects that challenge me to learn new technologies and apply
                theoretical knowledge to real-world problems.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {skills.map((skill, index) => (
              <Card
                key={index}
                className="hover:shadow-lg hover:scale-110 transition-all duration-300 float-animation"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4 text-center">
                  <Badge variant="secondary" className="text-sm font-medium gradient-bg text-white">
                    {skill}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl hover:scale-105 transition-all duration-500 pulse-glow"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader>
                  <CardTitle className="font-sans text-xl gradient-text">{project.title}</CardTitle>
                  <CardDescription className="font-serif">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-sm gradient-bg text-white border-none">
                    {project.tech}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">Experience</h2>
          <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 pulse-glow">
            <CardContent className="p-8">
              <p className="font-serif text-lg text-muted-foreground text-center">
                Currently building my experience through academic projects and personal development. Open to
                internships, open-source contributions, and collaborative opportunities.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">Achievements</h2>
          <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 pulse-glow">
            <CardContent className="p-8">
              <p className="font-serif text-lg text-muted-foreground text-center">
                Working towards building a portfolio of achievements through hackathons, certifications, and academic
                excellence. Stay tuned for updates!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">Get In Touch</h2>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 hover:scale-110 transition-all duration-300">
              <Mail className="text-primary" size={20} />
              <a
                href="mailto:ankushrajsaha365@gmail.com"
                className="font-serif text-foreground hover:text-primary transition-colors"
              >
                ankushrajsaha365@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2 hover:scale-110 transition-all duration-300">
              <Phone className="text-primary" size={20} />
              <a href="tel:7003897566" className="font-serif text-foreground hover:text-primary transition-colors">
                **********
              </a>
            </div>
            <div className="flex items-center gap-2 hover:scale-110 transition-all duration-300">
              <Github className="text-primary" size={20} />
              <a
                href="https://github.com/ankushrajsaha365-dotcom"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-foreground hover:text-primary transition-colors"
                aria-label="Open GitHub Profile (opens in a new tab)"
              >
                GitHub Profile
              </a>
            </div>
            <div className="flex items-center gap-2 hover:scale-110 transition-all duration-300">
              <Linkedin className="text-primary" size={20} />
              <a href="#" className="font-serif text-foreground hover:text-primary transition-colors">
                LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 pulse-glow">
            <CardHeader>
              <CardTitle className="font-sans text-center gradient-text">Send me a message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleContactSubmit} className="space-y-4" aria-live="polite">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    className="font-serif hover:scale-105 transition-all duration-300"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={status === "sending"}
                    required
                    aria-label="Your name"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    className="font-serif hover:scale-105 transition-all duration-300"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={status === "sending"}
                    required
                    aria-label="Your email"
                  />
                </div>

                <Input
                  name="subject"
                  placeholder="Subject (optional)"
                  className="font-serif hover:scale-105 transition-all duration-300"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  disabled={status === "sending"}
                  aria-label="Subject"
                />

                <Textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  className="font-serif hover:scale-105 transition-all duration-300"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  disabled={status === "sending"}
                  required
                  aria-label="Your message"
                />

                {status === "success" && (
                  <p className="text-green-600 text-sm">Thanks! Your message has been sent successfully.</p>
                )}
                {status === "fallback" && (
                  <p className="text-amber-600 text-sm">
                    Email service isn’t configured. We opened your mail app so you can send the message directly.
                  </p>
                )}
                {status === "error" && errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

                <Button
                  type="submit"
                  className="w-full gradient-bg hover:scale-110 transition-all duration-300"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 gradient-bg text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif">© 2025 Ankush Raj Saha. Built with passion and code.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 gradient-bg pulse-glow"
          size="icon"
        >
          <ChevronUp size={20} />
        </Button>
      )}

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  )
}
