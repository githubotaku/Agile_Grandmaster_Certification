import { redirect } from "next/navigation";

// The quiz now lives inline on the home page.
export default function QuizPage() {
  redirect("/");
}
