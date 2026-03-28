"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { submitContact } from "@/app/contact/action";
import { useState, useActionState } from "react";

const contactSchema = z.object({
  name: z.string().check(z.minLength(1, "이름을 입력해주세요")),
  email: z.email("올바른 이메일 주소를 입력해주세요"),
  phone: z.string().optional(),
  message: z.string().check(z.minLength(1, "문의내용을 입력해주세요")),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      setServerError("");
      const result = await submitContact(formData);
      if (result.success) {
        setSubmitted(true);
        reset();
      } else if (result.errors) {
        const firstError = Object.values(result.errors).flat()[0];
        if (firstError) setServerError(firstError);
      }
      return result;
    },
    null
  );

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-navy">
            문의가 접수되었습니다
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            빠른 시일 내에 답변 드리겠습니다.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => setSubmitted(false)}
          >
            새 문의 작성
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form
          action={formAction}
          className="space-y-5"
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              이름 <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              {...register("name")}
              placeholder="이름을 입력해주세요"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              이메일 <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
              전화번호
            </label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="010-0000-0000 (선택)"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
              문의내용 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="문의하실 내용을 입력해주세요"
              rows={6}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-500">{serverError}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-navy hover:bg-navy-dark"
          >
            {isPending ? "전송 중..." : "문의 보내기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
