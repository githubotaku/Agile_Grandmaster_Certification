import "server-only";

// Correct answer for each quiz question, keyed by question id.
// Kept out of the QUIZ_QUESTIONS module (and marked server-only) so it
// never ships to the client.
export const QUIZ_ANSWER_KEY: Record<string, string> = {
  q1: "b",
  q2: "b",
  q3: "c",
};
