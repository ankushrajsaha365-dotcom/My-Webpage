// Always send to your email: CONTACT_TO_EMAIL or fallback to "ankushrajsaha365@gmail.com"
const TO_EMAIL = process.env.CONTACT_TO_EMAIL?.trim() || "ankushrajsaha365@gmail.com"

type Incoming = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function sanitize(text: string) {
  return (text || "").toString().slice(0, 5000)
}

function buildMailto({ name, email, subject, message }: Required<Incoming>) {
  const s = encodeURIComponent(`[Portfolio] ${subject} — ${name}`)
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
  return `mailto:${TO_EMAIL}?subject=${s}&body=${body}`
}

async function parseBody(req: Request): Promise<Incoming> {
  const ct = req.headers.get("content-type") || ""
  try {
    if (ct.includes("application/json")) {
      return await req.json()
    }
    if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const fd = await req.formData()
      return {
        name: (fd.get("name") as string) || "",
        email: (fd.get("email") as string) || "",
        subject: (fd.get("subject") as string) || "",
        message: (fd.get("message") as string) || "",
      }
    }
    // Default attempt JSON
    return await req.json()
  } catch {
    // If parsing fails, attempt formData as a last resort
    try {
      const fd = await req.formData()
      return {
        name: (fd.get("name") as string) || "",
        email: (fd.get("email") as string) || "",
        subject: (fd.get("subject") as string) || "",
        message: (fd.get("message") as string) || "",
      }
    } catch {
      return {}
    }
  }
}

export async function POST(req: Request) {
  // Parse and validate inputs
  const raw = await parseBody(req)
  const name = sanitize(raw.name || "")
  const email = sanitize(raw.email || "")
  const subject = sanitize(raw.subject || "")
  const message = sanitize(raw.message || "")

  if (!name || !email || !subject || !message) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "missing_fields",
        message: "Please fill name, email, subject, and message.",
      }),
      { status: 400, headers: { "content-type": "application/json" } },
    )
  }
  if (!isEmail(email)) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "invalid_email",
        message: "Please provide a valid email address.",
      }),
      { status: 400, headers: { "content-type": "application/json" } },
    )
  }

  // Try provider send (Resend) when configured
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend")
      const resend = new Resend(RESEND_API_KEY)

      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p style="white-space: pre-wrap; line-height: 1.5;">${message}</p>
        </div>
      `
      // Using onboarding@resend.dev for development reliability
      const { error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [TO_EMAIL],
        subject: `[Portfolio] ${subject} — ${name}`,
        html,
      })
      if (error) {
        // If provider returns an error, fall back with mailto
        const mailto = buildMailto({ name, email, subject, message })
        return new Response(
          JSON.stringify({
            ok: false,
            error: "provider_error",
            message: "Email service returned an error. You can continue via your email app.",
            mailto,
          }),
          { status: 502, headers: { "content-type": "application/json" } },
        )
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    } catch (_err) {
      // Provider import/usage failed -> mailto fallback
      const mailto = buildMailto({ name, email, subject, message })
      return new Response(
        JSON.stringify({
          ok: false,
          error: "provider_failure",
          message: "Email provider not available. You can continue via your email app.",
          mailto,
        }),
        { status: 502, headers: { "content-type": "application/json" } },
      )
    }
  }

  // No provider configured -> instruct client to use mailto fallback
  const mailto = buildMailto({ name, email, subject, message })
  return new Response(
    JSON.stringify({
      ok: false,
      error: "not_configured",
      message: "Direct sending is not configured. Opening your email app is recommended.",
      mailto,
    }),
    { status: 503, headers: { "content-type": "application/json" } },
  )
}
