export async function POST(req: Request) {
  try {
    const { messages, context = [] } = await req.json()

    console.log("[v0] Chat API called with messages:", messages.length, "context items:", context.length)

    const lastMessageRaw = messages?.[messages.length - 1]?.content ?? ""
    const lastMessage = String(lastMessageRaw).toLowerCase()

    const respond = (message: string, intent: string) =>
      Response.json({
        message,
        metadata: {
          responseType: "keyword",
          intent,
          conversationLength: messages.length,
          hasContext: Array.isArray(context) ? context.length > 0 : false,
        },
      })

    // Pricing / rate / budget intent
    if (/\b(price|pricing|rate|rates|charge|fee|budget|quote|cost)\b/.test(lastMessage)) {
      if (/\b(website|web|site)\b/.test(lastMessage)) {
        return respond(
          "For website development, Ankush’s rates start around ₹15,000 for a basic site and ₹25,000–50,000 for more complex apps. For a tailored quote, please email ankushrajsaha365@gmail.com with your requirements.",
          "pricing",
        )
      }
      if (/\b(hourly|per hour|hour)\b/.test(lastMessage)) {
        return respond(
          "Ankush’s typical hourly rate ranges from ₹500–₹800, depending on scope and complexity. For an exact estimate, please reach out at ankushrajsaha365@gmail.com.",
          "pricing",
        )
      }
      return respond(
        "Pricing depends on scope. As a general guide: basic websites start at ₹15,000; complex apps ₹25,000–₹50,000; hourly work ₹500–₹800. For a precise quote, contact: ankushrajsaha365@gmail.com.",
        "pricing",
      )
    }

    // Availability intent
    if (/\b(available|availability|free|hire|capacity|schedule)\b/.test(lastMessage)) {
      return respond(
        "Yes—Ankush is currently available for new projects. He can typically start consultations right away and begin within 1–2 weeks. Email: ankushrajsaha365@gmail.com or call 7003897566 to confirm dates.",
        "availability",
      )
    }

    // Timeline intent
    if (/\b(timeline|how long|delivery|duration|turnaround|timeframe|deadline)\b/.test(lastMessage)) {
      if (/\b(simple|basic|landing)\b/.test(lastMessage)) {
        return respond("Simple websites or landing pages are usually delivered in 5–7 days.", "timeline")
      }
      if (/\b(complex|ecommerce|application|app)\b/.test(lastMessage)) {
        return respond(
          "Complex applications typically take 3–6 weeks, depending on features and integrations.",
          "timeline",
        )
      }
      return respond(
        "Typical timelines: simple sites 5–7 days; standard apps 2–3 weeks; complex apps 3–6 weeks. Share your scope for a precise estimate.",
        "timeline",
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.log("[v0] No OpenAI API key found, using enhanced fallback responses")

      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""
      const conversationHistory = context.join(" ").toLowerCase()

      let response = ""
      let foundMatch = false

      if (lastMessage.includes("hello") || lastMessage.includes("hi") || lastMessage.includes("hey")) {
        response =
          "Hello! I'm here to help you learn more about Ankush Raj Saha. Feel free to ask about his skills, projects, education, or contact information!"
        foundMatch = true
      } else if (lastMessage.includes("skill") || lastMessage.includes("technology")) {
        response =
          "Ankush specializes in JavaScript, Python, React, Node.js, Machine Learning, TensorFlow, PyTorch, SQL, and Git. He's passionate about AI/ML technologies!"
        foundMatch = true
      } else if (lastMessage.includes("project")) {
        response =
          "Ankush has worked on several projects including an AI Chat Assistant using Python & NLP, an E-commerce Website with React & Node.js, and a Data Visualization Dashboard using Python & Plotly."
        foundMatch = true
      } else if (lastMessage.includes("contact") || lastMessage.includes("email") || lastMessage.includes("phone")) {
        response =
          "You can reach Ankush at ankushrajsaha365@gmail.com or call him at 7003897566. He's open to internships and collaborations!"
        foundMatch = true
      } else if (
        lastMessage.includes("education") ||
        lastMessage.includes("study") ||
        lastMessage.includes("college")
      ) {
        response =
          "Ankush is a 2nd-year B.Tech student at MCKV Institute of Engineering, specializing in Computer Science & Engineering with AI & ML."
        foundMatch = true
      } else if (lastMessage.includes("experience") || lastMessage.includes("work")) {
        response =
          "Ankush is currently building his experience through various projects and is actively seeking internships and collaboration opportunities in AI/ML and web development."
        foundMatch = true
      } else if (
        lastMessage.includes("expertise") ||
        lastMessage.includes("expert") ||
        lastMessage.includes("knowledge") ||
        lastMessage.includes("specialization")
      ) {
        response =
          "Ankush's expertise spans across multiple domains: Full-Stack Web Development (React, Node.js, JavaScript), AI & Machine Learning (Python, TensorFlow, PyTorch), Data Science & Visualization (Python, Plotly), and Database Management (SQL). He combines theoretical knowledge from his CS engineering studies with practical project experience."
        foundMatch = true
      } else if (
        lastMessage.includes("ai") ||
        lastMessage.includes("machine learning") ||
        lastMessage.includes("ml") ||
        lastMessage.includes("artificial intelligence")
      ) {
        response =
          "Ankush has strong expertise in AI & Machine Learning! He's proficient in Python, TensorFlow, PyTorch, and NLP technologies. He's built AI chat assistants and works on ML projects as part of his specialization."
        foundMatch = true
      } else if (
        lastMessage.includes("frontend") ||
        lastMessage.includes("react") ||
        lastMessage.includes("javascript") ||
        lastMessage.includes("ui")
      ) {
        response =
          "Ankush excels in frontend development! He's skilled in React, JavaScript, HTML/CSS, and modern UI/UX design principles. This very portfolio showcases his frontend capabilities with responsive design, smooth animations, and interactive elements."
        foundMatch = true
      } else if (
        lastMessage.includes("backend") ||
        lastMessage.includes("server") ||
        lastMessage.includes("api") ||
        lastMessage.includes("database")
      ) {
        response =
          "Ankush has solid backend development skills using Node.js, Python, and SQL databases. He can build robust APIs, handle server-side logic, and manage databases effectively."
        foundMatch = true
      } else if (
        lastMessage.includes("charge") ||
        lastMessage.includes("fee") ||
        lastMessage.includes("payment") ||
        lastMessage.includes("cost") ||
        lastMessage.includes("price") ||
        lastMessage.includes("rate") ||
        lastMessage.includes("budget") ||
        lastMessage.includes("quote")
      ) {
        if (lastMessage.includes("website") || lastMessage.includes("web")) {
          response =
            "For website development projects, Ankush offers competitive rates starting from ₹15,000 for basic websites and ₹25,000-50,000 for complex web applications. Please contact him at ankushrajsaha365@gmail.com for a detailed quote tailored to your project needs."
        } else if (lastMessage.includes("hourly") || lastMessage.includes("per hour")) {
          response =
            "Ankush's hourly rate for freelance work is ₹500-800 per hour, depending on the complexity and type of work. Contact him at ankushrajsaha365@gmail.com to discuss your specific requirements."
        } else {
          response =
            "For detailed pricing and project quotes, please contact Ankush directly at ankushrajsaha365@gmail.com or call him at 7003897566. He offers competitive rates and flexible pricing options."
        }
        foundMatch = true
      } else if (
        lastMessage.includes("timeline") ||
        lastMessage.includes("how long") ||
        lastMessage.includes("delivery") ||
        lastMessage.includes("time") ||
        lastMessage.includes("duration")
      ) {
        if (lastMessage.includes("simple") || lastMessage.includes("basic") || lastMessage.includes("landing")) {
          response =
            "For simple websites or landing pages, Ankush can typically deliver within 5-7 days. Contact him at ankushrajsaha365@gmail.com to discuss your specific timeline requirements."
        } else if (
          lastMessage.includes("complex") ||
          lastMessage.includes("ecommerce") ||
          lastMessage.includes("application")
        ) {
          response =
            "Complex web applications and e-commerce sites typically take 3-6 weeks to complete, depending on features and integrations required. Contact him at ankushrajsaha365@gmail.com to discuss your project timeline."
        } else {
          response =
            "Project timelines vary based on complexity: Simple websites: 5-7 days, Standard web apps: 2-3 weeks, Complex applications: 3-6 weeks. Contact him at ankushrajsaha365@gmail.com to discuss your specific timeline needs."
        }
        foundMatch = true
      } else if (
        lastMessage.includes("available") ||
        lastMessage.includes("availability") ||
        lastMessage.includes("free") ||
        lastMessage.includes("hire")
      ) {
        response =
          "Yes, Ankush is currently available for new projects! He can start consultations immediately and begin new projects within 1-2 weeks. Contact him at ankushrajsaha365@gmail.com or call 7003897566 to discuss your project and check specific availability dates."
        foundMatch = true
      } else if (
        lastMessage.includes("portfolio") ||
        lastMessage.includes("examples") ||
        lastMessage.includes("previous work")
      ) {
        response =
          "You can see Ankush's work right here on this portfolio! He's built AI chat assistants, e-commerce websites, and data visualization dashboards. This very website demonstrates his modern web development capabilities!"
        foundMatch = true
      }

      if (!foundMatch) {
        response =
          "I'm sorry, I don't have specific information about that topic. I can help you with questions about Ankush's skills, projects, education, contact information, availability, pricing, or project timelines. What would you like to know about Ankush's professional background?"
      }

      if (foundMatch) {
        const followUpSuggestions = [
          "Would you like to know about his availability?",
          "Interested in seeing his project portfolio?",
          "Need information about pricing and timelines?",
          "Want to discuss a specific project requirement?",
        ]

        if (Math.random() > 0.3 && !lastMessage.includes("hello") && !lastMessage.includes("hi")) {
          const randomSuggestion = followUpSuggestions[Math.floor(Math.random() * followUpSuggestions.length)]
          response += ` ${randomSuggestion}`
        }
      }

      return Response.json({
        message: response,
        metadata: {
          responseType: "fallback",
          conversationLength: messages.length,
          hasContext: context.length > 0,
        },
      })
    }

    const systemPrompt = `You are Ankush Raj Saha's AI assistant on his portfolio website. You are knowledgeable, professional, and engaging.

About Ankush:
- 2nd-year B.Tech student at MCKV Institute of Engineering
- Specializing in Computer Science & Engineering with AI & ML
- Skills: JavaScript, Python, React, Node.js, Machine Learning, TensorFlow, PyTorch, SQL, Git, HTML/CSS
- Projects: AI Chat Assistant (Python, NLP), E-commerce Website (React, Node.js), Data Visualization Dashboard (Python, Plotly)
- Contact: ankushrajsaha365@gmail.com, Phone: 7003897566
- Available for web development, AI/ML projects, and business collaborations
- Competitive rates: Basic websites ₹15,000+, Complex apps ₹25,000-50,000, Hourly ₹500-800
- Quick turnaround: Simple sites 5-7 days, Complex apps 3-6 weeks

Conversation Context: ${context.join(", ")}

Guidelines:
- Be conversational and helpful
- Provide specific information when asked
- If you don't know something specific, say "I don't have that information" and redirect to what you do know
- Be honest about limitations - don't make up information
- Suggest contacting Ankush directly for detailed or specific questions you can't answer
- Keep responses concise but informative (max 150 words)
- If asked about pricing, provide ranges and suggest direct contact for quotes`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
        ],
        max_tokens: 300, // Increased token limit for more detailed responses
        temperature: 0.8, // Slightly increased for more natural conversation
        presence_penalty: 0.1, // Added to encourage topic diversity
        frequency_penalty: 0.1, // Added to reduce repetition
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] OpenAI API error:", response.status, errorText)
      throw new Error(`OpenAI API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] OpenAI response received successfully")

    const message = data.choices[0]?.message?.content || "I'm sorry, I couldn't process that request."

    return Response.json({
      message,
      metadata: {
        responseType: "openai",
        model: "gpt-3.5-turbo",
        conversationLength: messages.length,
        tokensUsed: data.usage?.total_tokens || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return Response.json(
      {
        message:
          "I'm Ankush's AI assistant! I'm having a brief connection issue, but I'm here to help. Ask me about his skills, projects, availability, or business services!",
        metadata: {
          responseType: "error_fallback",
          error: true,
        },
      },
      { status: 200 },
    )
  }
}
