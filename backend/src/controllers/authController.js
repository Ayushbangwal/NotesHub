import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { validationResult } from 'express-validator';
import { sendOTPEmail, sendPasswordResetEmail } from '../utils/emailService.js';

// OTP generate karne ka helper
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register — OTP bhejo, account banao (unverified)
export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      username,
      email,
      password,
      isEmailVerified: false,
      emailOTP: otp,
      emailOTPExpiry: otpExpiry
    });

    await user.save();

    // OTP email bhejo
    sendOTPEmail({ email, username, otp }).catch(err =>
      console.error('OTP email error:', err)
    );

    res.status(201).json({
      message: 'Account created! Please verify your email with the OTP sent.',
      requiresVerification: true,
      email
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// OTP Verify karo
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    if (!user.emailOTP || user.emailOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.emailOTPExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Verify karo
    user.isEmailVerified = true;
    user.emailOTP = null;
    user.emailOTPExpiry = null;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully!',
      user,
      token
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

// OTP Resend karo
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ message: 'Email already verified' });

    const otp = generateOTP();
    user.emailOTP = otp;
    user.emailOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    sendOTPEmail({ email, username: user.username, otp }).catch(err =>
      console.error('Resend OTP error:', err)
    );

    res.json({ message: 'New OTP sent to your email!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.isBanned) return res.status(403).json({ message: 'Account has been banned' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Email verified check
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'Please verify your email first.',
        requiresVerification: true,
        email: user.email
      });
    }

    const token = generateToken(user._id);
    res.json({ message: 'Login successful', user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Forgot Password — reset link bhejo
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });

    // Security: user mile ya na mile, same response do
    if (!user) {
      return res.json({ message: 'If this email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    sendPasswordResetEmail({
      email: user.email,
      username: user.username,
      resetToken
    }).catch(err => console.error('Reset email error:', err));

    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password — naya password set karo
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successful! Please login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
export const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};