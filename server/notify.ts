import nodemailer from 'nodemailer';
import pool from './db';

interface Booking {
  id: number;
  from_city: string;
  to_city: string;
  rooms: string;
  notes: string;
  client_name: string;
  client_phone: string;
  email?: string | null;
  created_at: string;
}

export async function sendBookingNotification(booking: Booking) {
  try {
    // Get notification settings
    const result = await pool.query("SELECT value FROM settings WHERE key = 'notifications'");
    if (result.rows.length === 0) return;

    const settings = result.rows[0].value;

    // Email notification
    if (settings.email_enabled && settings.email_to) {
      await sendEmailNotification(booking, settings);
    }

    // WhatsApp notification
    if (settings.whatsapp_enabled && settings.whatsapp_to) {
      await sendWhatsAppNotification(booking, settings);
    }
    
    // Customer Receipt Notification
    if (booking.email) {
      await sendCustomerReceipt(booking);
    }
  } catch (err) {
    console.error('Notification error:', err);
  }
}

async function sendCustomerReceipt(booking: Booking) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    const htmlBody = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f172a; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #f59e0b; margin: 0;">🚚 شركة ركن الريان للنقل اللوجستي</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1e293b;">مرحباً ${booking.client_name}،</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            شكراً لتواصلك مع شركة ركن الريان! لقد استلمنا طلب التسعير الخاص بك بنجاح.
          </p>
          <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>تفاصيل الطلب:</strong></p>
            <ul style="color: #475569;">
              <li>من: ${booking.from_city}</li>
              <li>إلى: ${booking.to_city}</li>
            </ul>
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            سيقوم أحد ممثلي المبيعات لدينا بالتواصل معك قريباً على الرقم (${booking.client_phone}) لتقديم عرض السعر المناسب.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 30px;">
            أطيب التحيات،<br>
            فريق ركن الريان
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"ركن الريان للنقل اللوجستي" <${process.env.SMTP_USER || 'noreply@roknelryan.com'}>`,
      to: booking.email,
      subject: `🚚 تم استلام طلبك بنجاح - ركن الريان`,
      html: htmlBody,
    });

    console.log(`📧 Customer receipt sent to ${booking.email}`);
  } catch (err) {
    console.error('Customer receipt email failed:', err);
  }
}

async function sendEmailNotification(booking: Booking, settings: any) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    const htmlBody = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f172a; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #f59e0b; margin: 0;">🚚 ركن الريان للنقل المبرد</h1>
          <p style="color: #94a3b8; margin: 5px 0 0;">طلب حجز جديد</p>
        </div>
        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #64748b;">اسم العميل:</td><td style="padding: 8px;">${booking.client_name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #64748b;">رقم الجوال:</td><td style="padding: 8px;" dir="ltr">${booking.client_phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #64748b;">من مدينة:</td><td style="padding: 8px;">${booking.from_city}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #64748b;">إلى مدينة:</td><td style="padding: 8px;">${booking.to_city}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #64748b;">حجم الأثاث:</td><td style="padding: 8px;">${booking.rooms || 'غير محدد'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #64748b;">ملاحظات:</td><td style="padding: 8px;">${booking.notes || 'لا توجد'}</td></tr>
          </table>
          <div style="text-align: center; margin-top: 20px;">
            <a href="tel:${booking.client_phone}" style="background: #f59e0b; color: #0f172a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              📞 اتصل بالعميل
            </a>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"ركن الريان للنقل المبرد" <${process.env.SMTP_USER || 'noreply@Rokn Elryan.com'}>`,
      to: settings.email_to,
      subject: `🚚 طلب حجز جديد — ${booking.client_name} (${booking.from_city} → ${booking.to_city})`,
      html: htmlBody,
    });

    console.log(`📧 Email notification sent to ${settings.email_to}`);
  } catch (err) {
    console.error('Email notification failed:', err);
  }
}

async function sendWhatsAppNotification(booking: Booking, settings: any) {
  try {
    const message = encodeURIComponent(
      `🚚 *طلب حجز جديد — ركن الريان للنقل المبرد*\n\n` +
      `👤 *العميل:* ${booking.client_name}\n` +
      `📱 *الجوال:* ${booking.client_phone}\n` +
      `📍 *من:* ${booking.from_city} → *إلى:* ${booking.to_city}\n` +
      `🏠 *الحجم:* ${booking.rooms || 'غير محدد'}\n` +
      `📝 *ملاحظات:* ${booking.notes || 'لا توجد'}\n\n` +
      `⏰ *الوقت:* ${new Date(booking.created_at).toLocaleString('ar-SA')}`
    );

    // Using WhatsApp API URL (can be integrated with WhatsApp Business API later)
    const waUrl = `https://api.whatsapp.com/send/?phone=${settings.whatsapp_to}&text=${message}`;
    
    console.log(`📱 WhatsApp notification ready for ${settings.whatsapp_to}`);
    console.log(`   URL: ${waUrl}`);
    
    // NOTE: For automated WhatsApp messages, you need WhatsApp Business API.
    // For now, this logs the URL. You can integrate Twilio or WhatsApp Cloud API later.
    // The admin dashboard will show a "Send via WhatsApp" button with this URL.
  } catch (err) {
    console.error('WhatsApp notification failed:', err);
  }
}
