"use server";

import { z } from "zod/v4";

const contactSchema = z.object({
  name: z.string().check(z.minLength(1, "이름을 입력해주세요")),
  email: z.email("올바른 이메일 주소를 입력해주세요"),
  phone: z.string().optional(),
  message: z.string().check(z.minLength(10, "문의내용을 10자 이상 입력해주세요")),
});

export async function submitContact(formData: FormData) {
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

  // TODO: 이메일 전송 로직 (nodemailer 또는 Resend API 연동)
  console.log("문의 접수:", result.data);

  return { success: true as const };
}
