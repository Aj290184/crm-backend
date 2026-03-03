const otpTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your OTP Code</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 20px 0;
    }

    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.06);
      box-sizing: border-box;
    }

    .logo {
      text-align: center;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #4f46e5;
      margin-bottom: 16px;
    }

    .title {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      text-align: center;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 14px;
      color: #6b7280;
      text-align: center;
      margin-bottom: 24px;
    }

    .otp-box {
      text-align: center;
      margin-bottom: 20px;
    }

    .otp-label {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 6px;
    }

    .otp-code {
      display: inline-block;
      font-size: 26px;
      letter-spacing: 6px;
      font-weight: 700;
      color: #111827;
      background-color: #eef2ff;
      padding: 10px 18px;
      border-radius: 999px;
      border: 1px solid #c7d2fe;
    }

    .note {
      font-size: 12px;
      color: #6b7280;
      margin-top: 8px;
      text-align: center;
    }

    .button-wrapper {
      text-align: center;
      margin: 24px 0 16px;
    }

    .btn {
      display: inline-block;
      padding: 10px 24px;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 500;
    }

    .footer {
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
      margin-top: 14px;
      line-height: 1.4;
    }

    @media (max-width: 600px) {
      .container {
        margin: 0 10px;
        padding: 20px;
      }
      .otp-code {
        font-size: 22px;
        letter-spacing: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="title"> Verification OTP </div>
      <div class="subtitle">
        Use the OTP below to complete your verification. Do not share it with anyone.
      </div>

      <div class="otp-box">
        <div class="otp-label">One Time Password</div>
        <div class="otp-code">{OTP}</div>
        <div class="note">
          This code will expire in <strong>10 minutes</strong>.
        </div>
      </div>
      <div class="footer">
        If you did not request this, you can safely ignore this email.<br />
        © 2025 PROCODE CRM. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`

export { otpTemplate };