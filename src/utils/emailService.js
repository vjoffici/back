const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For Gmail, you'll need to:
  // 1. Enable 2-factor authentication
  // 2. Generate an "App Password" from Google Account settings
  // 3. Use that app password here
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD // Your Gmail App Password
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Email Verification</h1>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a202c; margin-top: 0;">Verify Your Email Address</h2>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Thank you for registering! Please use the following OTP code to verify your email address:
            </p>
            
            <div style="background: #f7fafc; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
              <h1 style="color: #667eea; font-size: 48px; margin: 0; letter-spacing: 10px;">${otp}</h1>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
              This OTP will expire in <strong>10 minutes</strong>.
            </p>
            
            <p style="color: #718096; font-size: 14px;">
              If you didn't request this verification, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #a0aec0; font-size: 12px; text-align: center;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };
