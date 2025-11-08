# 📧 Email OTP Setup Guide

## ✅ OTP Email Verification Feature Added!

Your website now has email verification with OTP (One-Time Password) for user registration.

---

## 🔧 Gmail Setup (Required)

To send OTP emails, you need to configure a Gmail account:

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the steps to enable 2FA

### Step 2: Generate App Password

1. After enabling 2FA, go back to **Security**
2. Under "Signing in to Google", click **App passwords**
3. Select app: **Mail**
4. Select device: **Other** (Custom name)
5. Enter name: "Backend API"
6. Click **Generate**
7. **Copy the 16-character password** (you'll need this)

### Step 3: Update .env File

Add these lines to your `.env` file in the backend folder:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

**Example:**
```env
EMAIL_USER=myapp@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## 🚀 How It Works

### Registration Flow with OTP:

1. **User enters details** (name, email, password)
2. **Clicks "Send OTP"**
3. **Backend generates 6-digit OTP**
4. **OTP sent to user's email**
5. **User enters OTP** in verification screen
6. **Backend verifies OTP**
7. **If valid, user is registered** and logged in
8. **Redirected to home page**

### OTP Features:

- ✅ **6-digit random OTP**
- ✅ **Expires in 10 minutes**
- ✅ **Beautiful email template**
- ✅ **Resend OTP option**
- ✅ **Prevents duplicate registrations**
- ✅ **Rate limiting** (5 attempts per 15 minutes)

---

## 📧 Email Template

Users receive a professional email with:
- Purple gradient header
- Large OTP code display
- Expiration time (10 minutes)
- Professional styling
- Security notice

---

## 🔒 Security Features

1. **OTP expires after 10 minutes**
2. **One-time use** (deleted after verification)
3. **Rate limiting** on OTP requests
4. **Email validation** before sending
5. **Prevents duplicate registrations**

---

## 🧪 Testing

### Test the OTP Flow:

1. **Start backend:**
   ```bash
   cd c:\Users\HP\Downloads\NEWFINAL
   npm run dev
   ```

2. **Start frontend:**
   ```bash
   cd c:\Users\HP\Downloads\NEWFINAL-frontend
   npm start
   ```

3. **Go to registration:**
   - Visit http://localhost:3001/register
   - Fill in your details
   - Use a **real email address** you can access
   - Click "Send OTP"

4. **Check your email:**
   - Look for email from your configured Gmail
   - Copy the 6-digit OTP

5. **Verify OTP:**
   - Enter the OTP in the verification screen
   - Click "Verify & Register"
   - You'll be logged in and redirected to home page

---

## 🎨 Frontend Features

### Registration Page:
- **Step 1:** Enter name, email, password
- **Step 2:** Verify OTP from email
- **Resend OTP** button
- **Back to registration** button
- **Google Sign-In** (skips OTP)

### Visual Feedback:
- ✅ Success messages (green)
- ❌ Error messages (red)
- 🔄 Loading states
- 🎨 Professional animations

---

## 📝 API Endpoints

### Send OTP:
```
POST /api/otp/send
Body: { "email": "user@example.com" }
```

### Verify OTP:
```
POST /api/otp/verify
Body: { "email": "user@example.com", "otp": "123456" }
```

### Register User (after OTP verification):
```
POST /api/auth/register
Body: { "name": "...", "email": "...", "password": "..." }
```

---

## ⚠️ Important Notes

1. **Gmail App Password** is required (not your regular password)
2. **2-Factor Authentication** must be enabled on Gmail
3. **OTP expires in 10 minutes** - users must verify quickly
4. **Rate limiting** prevents spam (5 requests per 15 minutes)
5. **Real email required** for testing

---

## 🔄 Alternative Email Providers

If you don't want to use Gmail, you can modify `src/utils/emailService.js`:

### For SendGrid:
```javascript
// Install: npm install @sendgrid/mail
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### For Mailgun:
```javascript
// Install: npm install mailgun-js
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});
```

---

## 🐛 Troubleshooting

### "Failed to send OTP"
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify Gmail App Password is correct
- Ensure 2FA is enabled on Gmail account

### "Invalid or expired OTP"
- OTP expires after 10 minutes
- Check if you entered the correct 6-digit code
- Try resending OTP

### Email not received
- Check spam/junk folder
- Verify email address is correct
- Wait a few minutes (email might be delayed)

---

## ✅ Setup Checklist

- [ ] Enable 2FA on Gmail account
- [ ] Generate Gmail App Password
- [ ] Add EMAIL_USER to .env file
- [ ] Add EMAIL_PASSWORD to .env file
- [ ] Restart backend server
- [ ] Test registration with real email
- [ ] Verify OTP email received
- [ ] Complete registration successfully

---

## 🎉 You're All Set!

Once configured, users will receive professional OTP emails for registration verification!
