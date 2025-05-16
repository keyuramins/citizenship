"use client";
import { useState, useEffect, useRef } from "react";
import { QuestionCard } from "./QuestionCard";
import TestNavigation from "../../components/tests/TestNavigation";
import { Timer } from "../Timer";
import { Button } from "../ui/button";
import { SocialShare } from "../SocialShare";
import Rating from "./Rating";
import SubscribeButton from "../SubscribeButton";

interface Question {
  question: string;
  options: string[];
  answer: string;
  category: string;
  explanation: string;
}

const TEST_DURATION = 45 * 60; // 45 minutes in seconds

export default function PracticeTestClient({ questions, isPremium, upgradePriceId }: { questions: Question[]; isPremium: boolean; upgradePriceId?: string }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | undefined)[]>(Array(questions.length).fill(undefined));
  const [review, setReview] = useState<boolean[]>(Array(questions.length).fill(false));
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (completed) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCompleted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [completed]);

  // Color coding for navigation
  const getNavColor = (idx: number) => {
    if (review[idx]) return "orange";
    if (answers[idx] === undefined) return "outline";
    if (answers[idx] === questions[idx].answer) return "green";
    return "red";
  };

  // Answer selection
  const handleAnswer = (option: string) => {
    if (completed) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = option;
      return next;
    });
  };

  // Review toggle
  const handleReview = () => {
    setReview((prev) => {
      const next = [...prev];
      next[current] = !next[current];
      return next;
    });
  };

  // Navigation
  const handleNavigate = (idx: number) => {
    if (!isPremium && idx >= 5) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    setCurrent(idx);
  };

  // Complete test
  const handleComplete = () => {
    setCompleted(true);
    clearInterval(timerRef.current!);
  };

  // Pass/fail logic
  const valuesQuestions = questions.filter(q => q.category === "values");
  const valuesCorrect = valuesQuestions.filter((q, i) => {
    const idx = questions.indexOf(q);
    return answers[idx] === q.answer;
  }).length;
  const totalCorrect = questions.filter((q, i) => answers[i] === q.answer).length;
  const passed = valuesCorrect === 5 && (totalCorrect / questions.length) >= 0.75;

  // Social share data
  const score = Math.round((totalCorrect / questions.length) * 100);
  const timeUsed = TEST_DURATION - timeLeft;
  const timeStr = new Date(timeUsed * 1000).toISOString().substr(11, 8);

  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-6 bg-card rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Test Complete</h2>
          <div className="mb-2">Score: <span className="font-semibold">{totalCorrect} / {questions.length}</span> ({score}%)</div>
          <div className="mb-2">Australian Values Questions Correct: <span className="font-semibold">{valuesCorrect} / 5</span></div>
          <div className="mb-2">Time Used: <span className="font-mono">{timeStr}</span></div>
          <div className="mb-4">
            {passed ? (
              <span className="text-green-600 font-semibold">You Passed!</span>
            ) : (
              <span className="text-red-600 font-semibold">You Did Not Pass</span>
            )}
          </div>
          {!isPremium && upgradePriceId && (
            <div className="mb-4">
              <SubscribeButton priceId={upgradePriceId} label="Upgrade Now" />
            </div>
          )}
          <SocialShare title="Citizenship Practice Test" link={typeof window !== 'undefined' ? window.location.href : ''} score={score} time={timeStr} />
          <Rating />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-card rounded shadow">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div>
            <div className="text-lg font-bold">Question {current + 1} of {questions.length}</div>
            <div className="text-sm text-orange-400 font-semibold mb-1">{questions[current].category === "values" ? "Australian Values Question" : null}</div>
          </div>
          <div className="flex items-center gap-2">
            <Timer seconds={timeLeft} />
          </div>
        </div>
        <div className="mb-4">
          <QuestionCard
            question={questions[current].question}
            options={questions[current].options}
            onAnswer={handleAnswer}
            selectedOption={answers[current]}
            correctOption={answers[current] ? questions[current].answer : undefined}
            explanation={questions[current].explanation}
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <div className="flex gap-2">
            <Button variant={review[current] ? "default" : "outline"} onClick={handleReview}>
              {review[current] ? "Marked for Review" : "Review Later"}
            </Button>
          </div>
          <div className="flex gap-2 flex-1 justify-center md:justify-end">
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              Previous
            </Button>
            {current < questions.length - 1 ? (
              <Button
                variant="outline"
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              >
                Next
              </Button>
            ) : null}
            <Button
              variant="secondary"
              onClick={handleComplete}
              disabled={answers.includes(undefined)}
            >
              Finish
            </Button>
          </div>
          <div className="text-muted-foreground text-center md:text-right">
            {answers.filter(a => a !== undefined).length} / {questions.length} answered
          </div>
        </div>
        <TestNavigation
          total={questions.length}
          current={current}
          onNavigate={handleNavigate}
          answers={answers}
          review={review}
          getNavColor={getNavColor}
          isPremium={isPremium}
        />
        {showToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-2 rounded shadow z-50">
            Upgrade to Premium to unlock all questions!
          </div>
        )}
      </div>
    </div>
  );
} 