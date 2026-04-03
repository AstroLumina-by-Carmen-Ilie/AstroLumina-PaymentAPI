import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import { env } from '../config/env.js';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'AstroLumina <carmen.ilie@astrolumina.ro>';
const ATTACHMENT_FILE = join(process.cwd(), env.RESEND_ATTACHMENT_PATH);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  filename: string;
}

export async function sendEmailWithAttachment({ to, subject, html, filename }: SendEmailParams) {
  if (!resend) {
    console.error('❌ Resend not configured - email not sent');
    return null;
  }

  try {
    const fileContent = readFileSync(ATTACHMENT_FILE, 'utf-8');

    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      attachments: [
        {
          filename,
          content: Buffer.from(fileContent).toString('base64'),
        },
      ],
    });

    console.log(`✅ Email sent to ${to}:`, data);
    return data;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}

export async function sendSoareleStralucireaTaEmail(to: string) {
  const subject = 'Soarele, Strălucirea Ta | Cadoul tău';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6366f1;">Soarele, Strălucirea Ta</h1>
      <p>Felicitări! Ai primit cadoul gratuit de la AstroLumina.</p>
      <p>În attachment vei găsi fișierul promis.</p>
      <p>Cu drag,<br>Echipa AstroLumina</p>
    </div>
  `;

  return sendEmailWithAttachment({
    to,
    subject,
    html,
    filename: env.RESEND_ATTACHMENT_PATH,
  });
}
