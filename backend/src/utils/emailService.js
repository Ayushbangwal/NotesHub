import nodemailer from 'nodemailer'

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// ✅ Download notification
export const sendDownloadNotification = async ({ ownerEmail, ownerName, noteTitle, downloaderName }) => {
  try {
    console.log('📧 Sending download email to:', ownerEmail)
    const transporter = createTransporter()
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
            <p style="color: #4b5563;"><strong>${downloaderName}</strong> just downloaded your note:</p>
            <div style="background: #ede9fe; border-left: 4px solid #4f46e5; padding: 14px 20px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #4f46e5; font-weight: bold; font-size: 16px;">📄 ${noteTitle}</p>
            </div>
            <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">View Dashboard</a>
          </div>
          <div style="padding: 16px 32px; background: #f3f4f6; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 NotesHub</p>
          </div>
        </div>
      `
    })
    console.log('✅ Download email sent to:', ownerEmail)
  } catch (error) {
    console.error('❌ Email send failed:', error.message)
  }
}

// ✅ Rating notification
export const sendRatingNotification = async ({ ownerEmail, ownerName, noteTitle, raterName, rating }) => {
  const stars = '⭐'.repeat(rating)
  try {
    const transporter = createTransporter()
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
            <p style="color: #4b5563;"><strong>${raterName}</strong> rated your note:</p>
            <div style="background: #ede9fe; border-left: 4px solid #4f46e5; padding: 14px 20px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; color: #4f46e5; font-weight: bold; font-size: 16px;">📄 ${noteTitle}</p>
              <p style="margin: 0; color: #7c3aed; font-size: 22px;">${stars} <span style="font-size: 14px; color: #6b7280;">(${rating}/5)</span></p>
            </div>
            <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">View Dashboard</a>
          </div>
          <div style="padding: 16px 32px; background: #f3f4f6; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 NotesHub</p>
          </div>
        </div>
      `
    })
    console.log('✅ Rating email sent to:', ownerEmail)
  } catch (error) {
    console.error('❌ Rating email failed:', error.message)
  }
}

// ✅ Report notification
export const sendReportNotification = async ({ adminEmail, reporterName, noteTitle, noteId, reason, description }) => {
  try {
    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"NotesHub" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🚨 Note Reported: "${noteTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #f9f9f9; border-radius: 10px; overflow: hidden;">
          <div style="background: #dc2626; padding: 24px 32px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🚨 NotesHub — Report Alert</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1f2937; margin-top: 0;">A note has been reported!</h2>
            <p style="color: #4b5563;"><strong>${reporterName}</strong> reported a note:</p>
            <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 14px 20px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; color: #dc2626; font-weight: bold;">📄 ${noteTitle}</p>
              <p style="margin: 0 0 4px 0; color: #7f1d1d;"><strong>Reason:</strong> ${reason.replace(/_/g, ' ').toUpperCase()}</p>
              ${description ? `<p style="margin: 4px 0 0 0; color: #7f1d1d;"><strong>Details:</strong> ${description}</p>` : ''}
            </div>
            <a href="${process.env.CLIENT_URL}/admin" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Review in Admin Panel</a>
          </div>
          <div style="padding: 16px 32px; background: #f3f4f6; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 NotesHub Admin</p>
          </div>
        </div>
      `
    })
    console.log('✅ Report email sent to admin:', adminEmail)
  } catch (error) {
    console.error('❌ Report email failed:', error.message)
  }
}

// ✅ NEW — OTP Verification Email
export const sendOTPEmail = async ({ email, username, otp }) => {
  try {
    console.log('📧 Sending OTP to:', email)
    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"NotesHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔐 Verify your NotesHub account — OTP: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #f9f9f9; border-radius: 10px; overflow: hidden;">
          <div style="background: #4f46e5; padding: 24px 32px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">NotesHub</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1f2937; margin-top: 0;">Verify your email 🔐</h2>
            <p style="color: #4b5563;">Hey <strong>${username}</strong>, welcome to NotesHub!</p>
            <p style="color: #4b5563;">Use this OTP to verify your email address:</p>
            <div style="background: #ede9fe; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <p style="margin: 0; font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #4f46e5;">${otp}</p>
            </div>
            <p style="color: #6b7280; font-size: 13px;">⏰ This OTP expires in <strong>10 minutes</strong>.</p>
            <p style="color: #6b7280; font-size: 13px;">If you didn't create an account, ignore this email.</p>
          </div>
          <div style="padding: 16px 32px; background: #f3f4f6; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 NotesHub</p>
          </div>
        </div>
      `
    })
    console.log('✅ OTP email sent to:', email)
  } catch (error) {
    console.error('❌ OTP email failed:', error.message)
  }
}

// ✅ NEW — Forgot Password Reset Email
export const sendPasswordResetEmail = async ({ email, username, resetToken }) => {
  try {
    console.log('📧 Sending password reset to:', email)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"NotesHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔑 Reset your NotesHub password`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #f9f9f9; border-radius: 10px; overflow: hidden;">
          <div style="background: #4f46e5; padding: 24px 32px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">NotesHub</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1f2937; margin-top: 0;">Reset your password 🔑</h2>
            <p style="color: #4b5563;">Hey <strong>${username}</strong>,</p>
            <p style="color: #4b5563;">Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Reset Password</a>
            </div>
            <p style="color: #6b7280; font-size: 13px;">⏰ This link expires in <strong>15 minutes</strong>.</p>
            <p style="color: #6b7280; font-size: 13px;">If you didn't request this, ignore this email — your password won't change.</p>
            <p style="color: #9ca3af; font-size: 12px; word-break: break-all;">Or copy: ${resetUrl}</p>
          </div>
          <div style="padding: 16px 32px; background: #f3f4f6; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 NotesHub</p>
          </div>
        </div>
      `
    })
    console.log('✅ Password reset email sent to:', email)
  } catch (error) {
    console.error('❌ Reset email failed:', error.message)
  }
}