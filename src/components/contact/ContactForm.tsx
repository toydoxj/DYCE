"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { submitContact } from "@/app/contact/action";
import { useState, useActionState } from "react";
import { contactSchema, type ContactFormData } from "@/lib/schemas/contact";
import { CheckCircle } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

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

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
            <CheckCircle className="h-8 w-8 text-brand" />
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
          {/* honeypot: 봇 방지용 숨겨진 필드 */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              이름 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="이름을 입력해주세요"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              이메일 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="example@email.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="010-0000-0000 (선택)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              문의내용 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="문의하실 내용을 입력해주세요"
              rows={6}
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <p className="text-xs text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-navy hover:bg-navy-dark"
            size="lg"
          >
            {isPending ? "전송 중..." : "문의 보내기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
