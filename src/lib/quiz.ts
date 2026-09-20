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
    question:
      "스크럼(Scrum)에서 스프린트가 끝날 때 완성된 작업을 이해관계자에게 시연하고 피드백을 받는 이벤트는 무엇인가요?",
    options: [
      { id: "a", label: "스프린트 계획 (Sprint Planning)" },
      { id: "b", label: "데일리 스크럼 (Daily Scrum)" },
      { id: "c", label: "스프린트 리뷰 (Sprint Review)" },
      { id: "d", label: "스프린트 회고 (Sprint Retrospective)" },
    ],
  },
  {
    id: "q2",
    question: "애자일 선언문(Agile Manifesto)의 4가지 핵심 가치 중 하나로 옳은 것은?",
    options: [
      { id: "a", label: "프로세스와 도구보다 개인과 상호작용을 가치있게 여긴다" },
      { id: "b", label: "작동하는 소프트웨어보다 포괄적인 문서를 가치있게 여긴다" },
      { id: "c", label: "고객과의 협력보다 계약 협상을 가치있게 여긴다" },
      { id: "d", label: "변화에 대응하기보다 계획을 따르는 것을 가치있게 여긴다" },
    ],
  },
  {
    id: "q3",
    question: "스크럼 가이드가 정의하는 스크럼 팀의 역할(Accountability)에 해당하지 않는 것은?",
    options: [
      { id: "a", label: "프로덕트 오너 (Product Owner)" },
      { id: "b", label: "스크럼 마스터 (Scrum Master)" },
      { id: "c", label: "개발자 (Developers)" },
      { id: "d", label: "프로젝트 매니저 (Project Manager)" },
    ],
  },
];
