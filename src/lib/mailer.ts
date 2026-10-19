import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface SendEmailResult {
  success: boolean;
  message: string;
  isMock: boolean;
}

const cleanEnvVar = (val: string | undefined): string => {
  if (!val) return "";
  return val.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
};

export async function sendMail(options: SendEmailOptions): Promise<SendEmailResult> {
  const smtpHost = cleanEnvVar(process.env.SMTP_HOST);
  const smtpPort = Number(cleanEnvVar(process.env.SMTP_PORT));
  const smtpSecure = cleanEnvVar(process.env.SMTP_SECURE) === "true";
  const smtpUser = cleanEnvVar(process.env.SMTP_USER);
  const smtpPass = cleanEnvVar(process.env.SMTP_PASS);

  const isMock = !smtpHost || smtpHost.includes("ethereal.email") || !smtpUser || !smtpPass;

  const transporter = nodemailer.createTransport({
    host: smtpHost || "smtp.ethereal.email",
    port: smtpPort || 587,
    secure: smtpSecure,
    auth: {
      user: smtpUser || "mock-user@clubcms.com",
      pass: smtpPass || "mock-pass",
    },
  });

  try {
    await transporter.sendMail({
      from: `"IEEE Student Branch VIT Pune" <${smtpUser || "ieeevitteam@gmail.com"}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`[SMTP Success] Email sent to ${options.to}`);
    return {
      success: true,
      message: "Email dispatched successfully.",
      isMock,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown mail error";
    // Never log email body — it may contain OTP codes or temporary passwords
    console.log("------------------------------------------");
    console.log(`[SMTP Notice] Failed to send email to ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Error: ${message}`);
    console.log("------------------------------------------");

    if (!isMock) {
      return {
        success: false,
        message: "Failed to send email",
        isMock: false,
      };
    }

    return {
      success: true,
      message: "Email processed in mock mode. Check server logs.",
      isMock: true,
    };
  }
}
