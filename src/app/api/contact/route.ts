import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uploadLimiter, getClientIdentifier } from "@/lib/rate-limit";
import { Resend } from "resend";

// Escape HTML to prevent XSS in emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
  recaptchaToken: z.string().optional(),
});

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    // In production, fail closed (reject) if reCAPTCHA is not configured
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction) {
      console.error(
        "SECURITY: reCAPTCHA secret key not configured in production!"
      );
      return false; // Reject in production
    }
    console.warn("reCAPTCHA secret key not configured (development mode)");
    return true; // Allow in development only
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    // We'll use 0.5 as threshold (you can adjust this)
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 submissions per hour per IP
    const clientId = getClientIdentifier(request.headers);
    const rateLimitResult = uploadLimiter.check(
      `contact:${clientId}`,
      3, // 3 submissions per hour max
      60 * 60 * 1000 // 1 hour
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many contact form submissions. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Verify reCAPTCHA token
    if (validatedData.recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(
        validatedData.recaptchaToken
      );
      if (!isValidRecaptcha) {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    // Log submission
    console.log("📧 New Contact Form Submission:");
    console.log("━".repeat(50));
    console.log(`From: ${validatedData.name} <${validatedData.email}>`);
    console.log(`Subject: ${validatedData.subject}`);
    console.log(`Message:\n${validatedData.message}`);
    console.log(`IP: ${clientId}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log("━".repeat(50));

    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    if (!process.env.CONTACT_EMAIL) {
      throw new Error("CONTACT_EMAIL is not configured");
    }

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send notification email to you
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.CONTACT_EMAIL,
      replyTo: validatedData.email,
      subject: `Contact Form: ${validatedData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 20px; }
            .label { font-weight: 600; color: #4b5563; margin-bottom: 5px; }
            .value { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; }
            .footer { background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .reply-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📧 New Contact Form Message</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div class="value">${escapeHtml(validatedData.name)}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${escapeHtml(validatedData.email)}</div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${escapeHtml(validatedData.subject)}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value" style="white-space: pre-wrap;">${escapeHtml(
                  validatedData.message
                )}</div>
              </div>
              <div style="text-align: center;">
                <a href="mailto:${escapeHtml(
                  validatedData.email
                )}?subject=Re: ${encodeURIComponent(
        validatedData.subject
      )}" class="reply-button">
                  Reply to ${escapeHtml(validatedData.name)}
                </a>
              </div>
            </div>
            <div class="footer">
              <p>Received: ${new Date().toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              })}</p>
              <p>IP Address: ${clientId}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation email to the sender
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: validatedData.email,
      subject: "Thanks for reaching out! Message received",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .check-icon { font-size: 48px; margin: 20px 0; }
            .timeline { margin: 20px 0; }
            .timeline-item { display: flex; margin: 15px 0; align-items: start; }
            .timeline-number { background: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0; margin-right: 12px; }
            .message-summary { background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin: 20px 0; }
            .footer { background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="check-icon">✅</div>
              <h1 style="margin: 0;">Message Received!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thanks for reaching out, ${escapeHtml(
                validatedData.name
              )}</p>
            </div>
            <div class="content">
              <p>Hi ${escapeHtml(validatedData.name)},</p>
              <p>I've received your message and wanted to confirm it arrived safely. I'll review it carefully and get back to you as soon as possible.</p>

              <div class="message-summary">
                <p style="margin: 0 0 10px 0; font-weight: 600; color: #4b5563;">Your message summary:</p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> ${escapeHtml(
                  validatedData.subject
                )}</p>
                <p style="margin: 5px 0;"><strong>Sent:</strong> ${new Date().toLocaleString(
                  "en-US",
                  { dateStyle: "full", timeStyle: "short" }
                )}</p>
              </div>

              <div class="timeline">
                <p style="font-weight: 600; color: #4b5563; margin-bottom: 15px;">What happens next:</p>
                <div class="timeline-item">
                  <div class="timeline-number">1</div>
                  <div>
                    <strong>Message Received</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280;">Your message has been delivered to my inbox</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-number">2</div>
                  <div>
                    <strong>Review & Respond</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280;">I'll carefully read your message and prepare a thoughtful response</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-number">3</div>
                  <div>
                    <strong>You'll Hear From Me</strong>
                    <p style="margin: 5px 0 0 0; color: #6b7280;">Expect a reply within 24 hours during weekdays</p>
                  </div>
                </div>
              </div>

              <p style="margin-top: 20px;">If you have any urgent matters, feel free to send another message.</p>
              <p>Best regards,<br>Your Name</p>
            </div>
            <div class="footer">
              <p>This is an automated confirmation email.</p>
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! I will get back to you soon.",
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
