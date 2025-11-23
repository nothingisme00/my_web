import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { uploadLimiter, getClientIdentifier } from '@/lib/rate-limit';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

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
        { error: 'Too many contact form submissions. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, log to console (replace with actual email sending in production)
    console.log('📧 New Contact Form Submission:');
    console.log('━'.repeat(50));
    console.log(`From: ${validatedData.name} <${validatedData.email}>`);
    console.log(`Subject: ${validatedData.subject}`);
    console.log(`Message:\n${validatedData.message}`);
    console.log(`IP: ${clientId}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log('━'.repeat(50));

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production, you would send an email here:
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'contact@yourdomain.com',
      to: 'your-email@example.com',
      replyTo: validatedData.email,
      subject: `Contact Form: ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${validatedData.name} (${validatedData.email})</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
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
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
