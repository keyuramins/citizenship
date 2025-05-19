"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { QuestionCard } from "./QuestionCard";
import TestNavigation from "../../components/tests/TestNavigation";
import { Timer } from "../Timer";
import { Button } from "../ui/button";
import { SocialShare } from "../SocialShare";
import Rating from "./Rating";
import SubscribeButton from "../SubscribeButton";
import { Bookmark } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "../ui/dialog";
import { toast } from "sonner";


interface Question {
  question: string;
  options: string[];
  answer: string;
  category: string;
  explanation: string;
}

const TEST_DURATION = 45 * 60; // 45 minutes in seconds

export default function PracticeTestClient({ questions, isPremium, upgradePriceId, testId }: { questions: Question[]; isPremium: boolean; upgradePriceId?: string; testId: string | number; }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | undefined)[]>(Array(questions.length).fill(undefined));
  const [review, setReview] = useState<boolean[]>(Array(questions.length).fill(false));
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  // Color coding for navigation (useCallback for reactivity)
  const getNavColor = useCallback((idx: number) => {
    if (review[idx]) return "orange";
    if (answers[idx] === undefined) return "outline";
    if (
      answers[idx]?.trim().toLowerCase() === questions[idx].answer.trim().toLowerCase()
    ) return "green";
    return "red";
  }, [answers, review, questions]);

  // Build navColors array for all 20 buttons
  const navColors = Array.from({ length: 20 }).map((_, idx) => {
    if (idx >= questions.length) return "outline";
    return getNavColor(idx);
  });

  // Answer selection
  const handleAnswer = (option: string) => {
    if (completed) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = option;
      return next;
    });
    setReview((prev) => {
      const next = [...prev];
      next[current] = false;
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

  // Complete test (with review check and confirmation)
  const handleSubmit = () => {
    const unanswered = answers
      .map((a, i) => (a === undefined ? i + 1 : null))
      .filter((n) => n !== null);
    const reviewQuestions = review
      .map((r, i) => (r ? i + 1 : null))
      .filter((n) => n !== null);

    if (unanswered.length > 0) {
      toast(
        `Unanswered questions: ${unanswered.join(", ")}`,
        { description: "Please answer all questions before submitting.", position: "top-center" }
      );
      return;
    }
    if (reviewQuestions.length > 0) {
      toast(
        `Questions in review: ${reviewQuestions.join(", ")}`,
        { description: "You have questions marked for review.", position: "top-center" }
      );
    }
    setShowConfirm(true);
  };
  const handleConfirmSubmit = () => {
    setShowConfirm(false);
    setCompleted(true);
    clearInterval(timerRef.current!);
  };
  const handleCancelSubmit = () => {
    setShowConfirm(false);
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

  // Warn user on reload/navigation if there are unanswered questions
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (answers.some(a => a === undefined)) {
        event.preventDefault();
        event.returnValue = ""; // Required for Chrome
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers]);

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
      <div className="w-full max-w-5xl p-5 bg-card rounded shadow">
        <div className="flex justify-between items-center mb-4 px-2 flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-bold">Practice Test {testId}</h1>
            <p className="text-gray-400">Answer all questions to complete the test</p>
          </div>
          <div className="flex items-center gap-2 border border-gray-600 rounded-md p-2">
            <Timer seconds={timeLeft} />
          </div>
        </div>
        <div className="w-full m-2 p-5 h-full border border-border rounded">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="text-lg font-bold">Question {current + 1} of {questions.length}</div>
            {questions[current].category === "values" && (
              <div className="text-sm text-orange-400 font-semibold mb-1">Australian Values Question</div>
            )}
          <Button 
            variant={review[current] ? "default" : "outline"}
            onClick={handleReview}
            className="whitespace-nowrap flex items-center gap-1"
            disabled={answers[current] !== undefined}
          >
            <Bookmark className="w-4 h-4" />
            {review[current] ? "Marked for Review" : "Review Later"}
          </Button>
        </div>
        <QuestionCard
          question={questions[current].question}
          options={questions[current].options}
          onAnswer={handleAnswer}
          selectedOption={answers[current]}
          correctOption={answers[current] ? questions[current].answer : undefined}
          explanation={questions[current].explanation}
        />
        {/* Row 1: Previous / Answered / Next */}
        <div className="flex items-center justify-between gap-2 mb-4 w-full">
          <Button
            variant="outline"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            Previous
          </Button>
          <div className="text-muted-foreground text-center flex-1">
            {answers.filter(a => a !== undefined).length} / {questions.length} answered
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            disabled={current === questions.length - 1}
          >
            Next
          </Button>
        </div>
        {/* Row 2: Pagination */}
        <div className="flex justify-center mb-4 w-full">
          <TestNavigation
            total={20}
            current={current}
            onNavigate={handleNavigate}
            navColors={navColors}
            isPremium={isPremium}
          />
        </div>
        {/* Row 3: Exit / Submit */}
        <div className="flex items-center justify-between mt-6 w-full">
          <Button variant="outline" onClick={() => {/* handle exit logic here */}}>Exit Test</Button>
          <Button
            variant="secondary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
        {/* Confirmation Dialog */}
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Test?</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to submit your test? You won't be able to change your answers after submission.</div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelSubmit}>Cancel</Button>
              <Button variant="secondary" onClick={handleConfirmSubmit}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {showToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-2 rounded shadow z-50">
            Upgrade to Premium to unlock all questions!
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 