import { NextResponse } from "next/server"

// We use Resend on the server if RESEND_API_KEY is available.
// npm modules are inferred automatically in this environment.
let Resend: any
try {
  // dynamic import avoids build errors if the dep isn't available yet
  // and only loads on the server where it's needed.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Resend = require("resend").Resend
} catch (_) {
  Resend = null
}

type ContactPayload = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload

    const name = (body.name || "").trim()
    const fromEmail = (body.email || "").trim()
    const subject = (body.subject || "New message from portfolio").trim()
    const message = (body.message || "").trim()

    // Basic validation
    if (!name || !fromEmail || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields (name, email, message)." }, { status: 400 })
    }

    const TO = process.env.CONTACT_TO_EMAIL
    const RESEND_KEY = process.env.RESEND_API_KEY

    // If no server email provider configured, return a helpful response
    if (!TO || !RESEND_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error: "Email service not configured. Please set RESEND_API_KEY and CONTACT_TO_EMAIL.",
          fallback: {
            mailto:
              (process.env.NEXT_PUBLIC_CONTACT_EMAIL &&
                `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} <${fromEmail}>\n\n${message}`)}`) ||
              null,
          },
        },
        { status: 503 },
      )
    }

    const resend = new Resend(RESEND_KEY)

    const text = [
      `You have a new message from your portfolio site:`,
      "",
      `From: ${name} <${fromEmail}>`,
      `Subject: ${subject}`,
      "",
      message,
    ].join("\n")

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: TO,
      reply_to: fromEmail,
      subject,
      text,
    })

    if (error) {
      console.log("[v0] Resend error:", error)
      return NextResponse.json({ ok: false, error: "Failed to send email via provider." }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.log("[v0] Contact API error:", err?.message || err)
    return NextResponse.json({ ok: false, error: "Unexpected server error." }, { status: 500 })
  }
}
