import { generateSequentialTests } from "../../../../lib/generateSequentialTests";
import { generateRandomizedTests } from "../../../../lib/generateRandomizedTests";
import PracticeTestClient from "../../../../components/tests/PracticeTestClient";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "../../../../lib/supabaseClient";

export default async function TestPage({ params }: { params: Promise<{ type: string; testId: string }> }) {
  const { type, testId } = await params;
  let tests;
  if (type === "sequential") {
    tests = await generateSequentialTests();
  } else if (type === "random") {
    tests = await generateRandomizedTests();
  } else {
    notFound();
  }
  const idx = parseInt(testId, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= tests.length) {
    notFound();
  }
  let questions = tests[idx];

  // Server-side: check subscription status
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPremium = !!user?.user_metadata?.subscription;
  if (!isPremium) {
    questions = questions.slice(0, 5); // Only first 5 questions for free users
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Practice Test {testId}</h1>
      <PracticeTestClient questions={questions} isPremium={isPremium} />
    </div>
  );
} 