import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

// Create reusable transporter object using the default SMTP transport
export const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Generate verification token
export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

// Generate verification expiry (24 hours from now)
export function generateVerificationExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24); // 24 hours from now
  return expiry;
}

// Send verification email
export async function sendVerificationEmail(
  email: string, 
  name: string, 
  token: string,
  provider: 'google' | 'github' | 'local' = 'local'
): Promise<void> {
  const transporter = createEmailTransporter();
  
  const verificationUrl = `${process.env.ORIGIN || 'http://localhost:5173'}/auth/verify-email?token=${token}`;
  
  const providerText = provider === 'local' ? 'our platform' : provider;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background: #218838;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
        .provider-badge {
          background: ${provider === 'google' ? '#4285f4' : provider === 'github' ? '#333' : '#6c757d'};
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔐 Verify Your Email</h1>
        <span class="provider-badge">Via ${providerText}</span>
      </div>
      
      <div class="content">
        <h2>Hello ${name}!</h2>
        
        <p>Thank you for signing up with ${providerText}! To complete your registration and secure your account, please verify your email address.</p>
        
        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">✅ Verify Email Address</a>
        </p>
        
        <p><strong>Why verify your email?</strong></p>
        <ul>
          <li>🛡️ Secure your account</li>
          <li>🔑 Enable password recovery</li>
          <li>📧 Receive important notifications</li>
          <li>✅ Complete your registration</li>
        </ul>
        
        <p><strong>Note:</strong> This verification link will expire in 24 hours for security reasons.</p>
        
        <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">
        
        <p style="font-size: 14px; color: #666;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <code style="background: #e9ecef; padding: 5px; border-radius: 3px; word-break: break-all;">
            ${verificationUrl}
          </code>
        </p>
      </div>
      
      <div class="footer">
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>© 2024 Your App Name. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Hello ${name}!

    Thank you for signing up with ${providerText}! 
    
    To complete your registration, please verify your email address by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours for security reasons.
    
    If you didn't create an account, you can safely ignore this email.
    
    Best regards,
    Your App Team
  `;

  const mailOptions = {
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `🔐 Verify your email address - ${providerText} signup`,
    text: textContent,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

// Send welcome email after verification
export async function sendWelcomeEmail(
  email: string, 
  name: string,
  provider: 'google' | 'github' | 'local' = 'local'
): Promise<void> {
  const transporter = createEmailTransporter();
  
  const dashboardUrl = `${process.env.ORIGIN || 'http://localhost:5173'}/dashboard`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Your App!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to Your App!</h1>
        <p>Your email has been verified successfully</p>
      </div>
      
      <div class="content">
        <h2>Hello ${name}!</h2>
        
        <p>Congratulations! Your email address has been successfully verified and your account is now fully activated.</p>
        
        <p style="text-align: center;">
          <a href="${dashboardUrl}" class="button">🚀 Go to Dashboard</a>
        </p>
        
        <p>You can now enjoy all the features of your account:</p>
        <ul>
          <li>✅ Full access to your dashboard</li>
          <li>🔧 Profile management</li>
          <li>🔐 Secure authentication</li>
          <li>📧 Email notifications</li>
        </ul>
        
        <p>If you have any questions or need help getting started, feel free to contact our support team.</p>
        
        <p>Welcome aboard!</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '🎉 Welcome! Your email has been verified',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email - it's not critical
  }
}
