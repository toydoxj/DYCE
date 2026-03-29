"use server";

import { z } from "zod/v4";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/schemas/contact";

// HTML 이스케이핑으로 XSS 방지
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function submitContact(formData: FormData) {
  // honeypot: 봇이 숨겨진 필드를 채우면 차단
  const honeypot = formData.get("website");
  if (honeypot) {
    return { success: true as const };
  }

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  };

  const result = contactSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const name = escapeHtml(result.data.name);
  const email = escapeHtml(result.data.email);
  const phone = result.data.phone ? escapeHtml(result.data.phone) : "-";
  const message = escapeHtml(result.data.message);

  try {
    await transporter.sendMail({
      from: `"동양구조 홈페이지" <${process.env.SMTP_USER}>`,
      to: "dyce@dyce.kr",
      replyTo: result.data.email,
      subject: `[홈페이지문의] ${name}님의 문의`,
      html: `
        <h2>홈페이지 문의가 접수되었습니다</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;font-weight:bold;width:100px;">이름</td>
            <td style="padding:10px;">${name}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;font-weight:bold;">이메일</td>
            <td style="padding:10px;">${email}</td>
          </tr>
          <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;font-weight:bold;">전화번호</td>
            <td style="padding:10px;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;vertical-align:top;">문의내용</td>
            <td style="padding:10px;white-space:pre-wrap;">${message}</td>
          </tr>
        </table>
      `,
    });

    return { success: true as const };
  } catch (error) {
    console.error("이메일 전송 실패:", error);
    return {
      success: false as const,
      errors: { message: ["문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요. 또는 전화(02-549-4566), 이메일(dyce@dyce.kr)로 직접 문의해주세요."] },
    };
  }
}
