import { z } from "zod";
import { ESSAY_MAX_LENGTH } from "@/lib/constants";

export const signupSchema = z.object({
  email: z.email("올바른 이메일 주소를 입력해주세요."),
  nameEn: z
    .string()
    .trim()
    .min(1, "영문 이름을 입력해주세요.")
    .max(100, "영문 이름이 너무 깁니다.")
    .regex(/^[A-Za-z .'-]+$/, "영문 이름은 영문자만 입력할 수 있습니다."),
  nameKo: z
    .string()
    .trim()
    .max(50, "한국어 이름이 너무 깁니다.")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .max(200, "비밀번호가 너무 깁니다."),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email("올바른 이메일 주소를 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const quizSubmitSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export const applicationSchema = z.object({
  essay: z
    .string()
    .trim()
    .min(1, "지원서 내용을 입력해주세요.")
    .max(
      ESSAY_MAX_LENGTH,
      `지원서 내용은 ${ESSAY_MAX_LENGTH.toLocaleString()}자 이하로 작성해주세요.`,
    ),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const rejectApplicationSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "반려 사유를 입력해주세요.")
    .max(1000, "반려 사유가 너무 깁니다."),
});
