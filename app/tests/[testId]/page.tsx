import { fetchQuestionsFromS3 } from "../../../lib/fetchQuestionsFromS3";
import { QuestionCard } from "./QuestionCard";
import { Suspense } from "react";

// Next.js 15: params should be an object, not a Promise. Do not type as Promise<any>.
export default async function TestPage({ params }: { params: { testId: string } }) {
  // For demonstration, use 'values' as the category. In production, map testId to category.
  const questions = await fetchQuestionsFromS3("values");
  // Only render the first question for now
  const firstQuestion = questions[0];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Practice Test: {params.testId}</h1>
      <Suspense fallback={<div>Loading question...</div>}>
        <ClientQuestionCard question={firstQuestion} />
      </Suspense>
    </div>
  );
}

// Client component for answer selection
'use client';
import { useState } from "react";

function ClientQuestionCard({ question }: { question: any }) {
  const [selected, setSelected] = useState<string | undefined>();
  return (
    <QuestionCard
      question={question.question}
      options={question.options}
      onAnswer={setSelected}
      selectedOption={selected}
      correctOption={selected ? question.answer : undefined}
    />
  );
} 