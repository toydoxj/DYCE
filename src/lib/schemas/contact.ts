import { z } from "zod/v4";

export const contactSchema = z.object({
  name: z.string().check(z.minLength(1, "이름을 입력해주세요")),
  email: z.email("올바른 이메일 주소를 입력해주세요"),
  phone: z.string().optional(),
  message: z.string().check(z.minLength(1, "문의내용을 입력해주세요")),
});

export type ContactFormData = z.infer<typeof contactSchema>;
