import nodemailer from 'nodemailer'

// Transporter — Gmail se connect karta hai
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// ✅ Download notification email
export const sendDownloadNotification = async ({ ownerEmail, ownerName, noteTitle, downloaderName }) => {
  try {
    await transporter.sendMail({
      from: `"NotesHub" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: `📥 "${noteTitle}" was downloaded!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #f9f9f9; border-radius: 10px; overflow: hidden;">
          <div style="background: #4f46e5; padding: 24px 32px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">NotesHub</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1f2937; margin-top: 0;">Someone downloaded your note! 📥</h2>
            <p style="color: #4b5563;">Hey <strong>${ownerName}</strong>,</p>
            <p style="color: #4b5563;">
              <strong>${downloaderName}</strong> just downloaded your note:
            </p>
            <div style="background: #ede9fe; border-left: 4px solid #4f46e5; padding: 14px 20px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #4f46e5; font-weight: bold; font-size: 16px;">📄 ${noteTitle}</p>
            </div>
            <p style="color: #6b7280; font-size: 13px;">Keep uploading quality notes — your content is being appreciated!</p>
            <a href="${process.env.CLIENT_URL}/dashboard" 
               style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
              View Dashboard
            </a>
          </div>
          <div style="padding: 16px 32px; background: #f3f4f6; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 NotesHub. You're receiving this because you uploaded a note.</p>
          </div>
        </div>
      `
    })
    console.log('✅ Download notification email sent to:', ownerEmail)
  } catch (error) {
    console.error('❌ Email send failed:', error.message)
    // Email fail hone se request fail na ho isliye error throw nahi kar rahe
  }
}

// ✅ Rating notification email
export const sendRatingNotification = async ({ ownerEmail, ownerName, noteTitle, raterName, rating }) => {
  const stars = '⭐'.repeat(rating)
  try {
    await transporter.sendMail({
      from: `"NotesHub" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: `⭐ "${noteTitle}" got rated ${rating}/5!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #f9f9f9; border-radius: 10px; overflow: hidden;">
          <div style="background: #4f46e5; padding: 24px 32px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">NotesHub</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1f2937; margin-top: 0;">Your note got a new rating! ${stars}</h2>
            <p style="color: #4b5563;">Hey <strong>${ownerName}</strong>,</p>
            <p style="color: #4b5563;">
              <strong>${raterName}</strong> rated your note:
            </p>
            <div style="background: #ede9fe; border-left: 4px solid #4f46e5; padding: 14px 20px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; color: #4f46e5; font-weight: bold; font-size: 16px;">📄 ${noteTitle}</p>
              <p style="margin: 0; color: #7c3aed; font-size: 22px;">${stars} <span style="font-size: 14px; color: #6b7280;">(${rating}/5)</span></p>
            </div>
            <p style="color: #6b7280; font-size: 13px;">Great work! Keep sharing quality notes with the community.</p>
            <a href="${process.env.CLIENT_URL}/dashboard" 
               style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
              View Dashboard
            </a>
          </div>
          <div style="padding: 16px 32px; background: #f3f4f6; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 NotesHub. You're receiving this because you uploaded a note.</p>
          </div>
        </div>
      `
    })
    console.log('✅ Rating notification email sent to:', ownerEmail)
  } catch (error) {
    console.error('❌ Email send failed:', error.message)
  }
}