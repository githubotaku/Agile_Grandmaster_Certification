// Public quiz content only — question text and answer options.
// This module is safe to import from Client Components.
// The correct-answer key lives separately in `quiz-answer-key.ts`,
// which is marked `server-only` so it can never end up in the client bundle.

export type QuizOption = { id: string; label: string };
export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "누군가 나로 인한 프로젝트의 실패를 비난한다. 해답은?",
    options: [
      { id: "a", label: "문제의 원인을 찾는 내부 회의를 연다" },
      { id: "b", label: "사람이라도 죽었냐고 따진다" },
      { id: "c", label: "목놓아 운다" },
    ],
  },
  {
    id: "q2",
    question:
      "기존 애자일 방법론과 이재황 애자일 방법론의 차이로 옳지 않은 것은?",
    options: [
      { id: "a", label: "이재황 애자일 방법론은 보다 섹시하다" },
      { id: "b", label: "이재황 애자일 방법론은 앞뒤 맥락을 고려하지 않는다" },
      { id: "c", label: "이재황 애자일 방법론은 고혹적이다" },
    ],
  },
  {
    id: "q3",
    question: "이재황 애자일 17원칙에 해당하는 것은?",
    options: [
      { id: "a", label: "모든 업무를 계획적으로 완벽하게 수행한다" },
      { id: "b", label: "회의 시간에 춤을 추거나 노래를 불러서는 안 된다" },
      { id: "c", label: "이재황 애자일 17원칙은 존재하지 않는다" },
    ],
  },
];
