import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId } = await auth();

    // Verify authentication
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to request a consultation.' }, { status: 401 });
    }

    const { cart, customerName, customerEmail } = await request.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!customerEmail) {
      return NextResponse.json({ error: 'Missing customer email' }, { status: 400 });
    }

    // --- 1. Persist the Consultation to the Database ---
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Save to MongoDB via Prisma
    const savedInquiry = await prisma.consultation.create({
      data: {
        customerName: customerName,
        customerEmail: customerEmail,
        totalPrice: cartTotal,
        items: cart, // JSON snapshot of the selection
        status: 'pending'
      }
    });

    // --- 2. Send the NodeMailer Email Confirmation ---
    
    // Ensure email credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn('NodeMailer Environment Variables missing. Consultation saved to DB, but email not sent.');
      return NextResponse.json({ 
        success: true, 
        message: 'Inquiry saved to database, but email dispatch skipped.', 
        inquiryId: savedInquiry.id 
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const formatPrice = (price) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(price);

    const emailHtml = `
      <div style="font-family: 'Times New Roman', Times, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; background-color: #fcfbf9; padding: 40px; border: 1px solid #e5e5e5;">
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #e5e5e5;">
          <h1 style="font-size: 24px; font-weight: normal; letter-spacing: 4px; text-transform: uppercase; margin: 0;">Santiago Bros</h1>
          <p style="font-size: 11px; letter-spacing: 2px; color: #666; text-transform: uppercase;">Official Consultation Request #${savedInquiry.id.slice(-6)}</p>
        </div>

        <p style="font-size: 16px; margin-bottom: 30px;">Dear ${customerName},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin-bottom: 40px;">
          Thank you for requesting a private consultation regarding your selection. 
          Your request has been logged in our system. A senior designer will contact you shortly.
        </p>

        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 10px; border-bottom: 1px solid #1a1a1a; margin-bottom: 20px;">Requested Selection</h3>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tbody>
            ${cart.map(item => `
              <tr style="border-bottom: 1px solid #e5e5e5;">
                <td style="padding: 15px 0;">
                  <strong style="font-size: 16px; font-weight: normal;">${item.name}</strong>
                  <span style="font-size: 12px; color: #666; display: block; margin-top: 4px;">Qty: ${item.quantity}</span>
                </td>
                <td style="padding: 15px 0; text-align: right; vertical-align: top; font-size: 16px;">
                  ${formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-bottom: 40px;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 4px;">Subtotal</p>
          <p style="font-size: 24px; margin: 0;">${formatPrice(cartTotal)}</p>
        </div>

        <div style="background-color: #1a1a1a; color: #fff; padding: 30px; text-align: center; margin-top: 40px;">
          <p style="font-size: 12px; margin: 0; letter-spacing: 1px; text-transform: uppercase;">Santiago Bros Barcelona</p>
          <p style="font-size: 11px; margin: 8px 0 0; color: #888;">Passeig de Gràcia 55, 08007 Barcelona, Spain</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Santiago Bros Support" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Inquiry #${savedInquiry.id.slice(-6)} | Santiago Bros`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry successfully saved and dispatched.',
      inquiryId: savedInquiry.id
    });

  } catch (error) {
    console.error('Inquiry Processing Error:', error);
    return NextResponse.json({ error: 'System error during checkout processing' }, { status: 500 });
  }
}
