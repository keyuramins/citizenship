// components/tests/PracticeTestClient.tsx
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
import { useRouter } from "next/navigation";
import { TestResult, TestType } from "../../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../../src/components/ui/progress";
import { format, formatDistanceToNow } from "date-fns";


interface Question {
  question: string;
  options: string[];
  answer: string;
  category: string;
  explanation: string;
}

interface PracticeTestClientProps {
  questions: Question[];
  isPremium: boolean;
  upgradePriceId?: string;
  testId: string | number;
  mode?: string;
  testResult?: TestResult | null;
}

const TEST_DURATION = 45 * 60; // 45 minutes in seconds

export default function PracticeTestClient({ questions, isPremium, upgradePriceId, testId, mode, testResult }: PracticeTestClientProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | undefined)[]>(Array(questions.length).fill(undefined));
  const [review, setReview] = useState<boolean[]>(Array(questions.length).fill(false));
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingExitUrl, setPendingExitUrl] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

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
    // if (!isPremium && idx >= 5) {
    //   setShowToast(true);
    //   setTimeout(() => setShowToast(false), 2000);
    //   return;
    // }
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
        `${unanswered.length} Question${unanswered.length > 1 ? 's' : ''} Unanswered`,
        { 
          description: `Please answer question${unanswered.length > 1 ? 's' : ''} ${unanswered.join(", ")} before submitting.`,
          position: "top-center",
          duration: 5000
        }
      );
      // Navigate to the first unanswered question
      setCurrent(unanswered[0] - 1);
      return;
    }

    if (reviewQuestions.length > 0) {
      toast(
        `${reviewQuestions.length} Question${reviewQuestions.length > 1 ? 's' : ''} Marked for Review`,
        { 
          description: `You have marked question${reviewQuestions.length > 1 ? 's' : ''} ${reviewQuestions.join(", ")} for review. You can still submit or review them.`,
          position: "top-center",
          duration: 5000
        }
      );
      setShowConfirm(true);
      return;
    }
    
    // If all questions are answered and none are marked for review, submit directly
    handleConfirmSubmit();
  };
  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setCompleted(true);
    clearInterval(timerRef.current!);

    // Calculate test results
    const valuesQuestions = questions.filter(q => q.category === "values");
    const valuesCorrect = valuesQuestions.filter((q, i) => {
      const idx = questions.indexOf(q);
      return answers[idx]?.toLowerCase() === q.answer.toLowerCase();
    }).length;
    const governmentQuestions = questions.filter(q => q.category === "government");
    const governmentCorrect = governmentQuestions.filter((q, i) => {
      const idx = questions.indexOf(q);
      return answers[idx]?.toLowerCase() === q.answer.toLowerCase();
    }).length;
    const beliefsQuestions = questions.filter(q => q.category === "beliefs");
    const beliefsCorrect = beliefsQuestions.filter((q, i) => {
      const idx = questions.indexOf(q);
      return answers[idx]?.toLowerCase() === q.answer.toLowerCase();
    }).length;
    const peopleQuestions = questions.filter(q => q.category === "people");
    const peopleCorrect = peopleQuestions.filter((q, i) => {
      const idx = questions.indexOf(q);
      return answers[idx]?.toLowerCase() === q.answer.toLowerCase();
    }).length;
    const totalCorrect = questions.filter((q, i) => answers[i]?.toLowerCase() === q.answer.toLowerCase()).length;

    const result: TestResult = {
      test_id: typeof testId === 'string' ? parseInt(testId, 10) : testId,
      attempt_count: 1, // This will be incremented server-side if needed
      correct_answers: totalCorrect,
      score_percent: Math.round((totalCorrect / questions.length) * 100),
      values_correct: valuesCorrect,
      government_correct: governmentCorrect,
      beliefs_correct: beliefsCorrect,
      people_correct: peopleCorrect,
      values_percent: Math.round((valuesCorrect / valuesQuestions.length) * 100),
      government_percent: Math.round((governmentCorrect / governmentQuestions.length) * 100),
      beliefs_percent: Math.round((beliefsCorrect / beliefsQuestions.length) * 100),
      people_percent: Math.round((peopleCorrect / peopleQuestions.length) * 100),
      time_used_seconds: TEST_DURATION - timeLeft,
      passed: valuesCorrect === valuesQuestions.length && (totalCorrect / questions.length) >= 0.75
    };

    try {
      const testType = (mode || 'sequential') as TestType;
      console.log('Submitting test result:', { testType, result });
      
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: testType,
          result,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Failed to save test results: ${errorText}`);
      }
    } catch (error) {
      console.error('Error saving test results:', error);
      toast.error('Failed to save test results. Please try again.');
    }
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
  const governmentQuestions = questions.filter(q => q.category === "government");
  const governmentCorrect = governmentQuestions.filter((q, i) => {
    const idx = questions.indexOf(q);
    return answers[idx] === q.answer;
  }).length;
  const beliefsQuestions = questions.filter(q => q.category === "beliefs");
  const beliefsCorrect = beliefsQuestions.filter((q, i) => {
    const idx = questions.indexOf(q);
    return answers[idx] === q.answer;
  }).length;
  const peopleQuestions = questions.filter(q => q.category === "people");
  const peopleCorrect = peopleQuestions.filter((q, i) => {
    const idx = questions.indexOf(q);
    return answers[idx] === q.answer;
  }).length;
  const totalCorrect = questions.filter((q, i) => answers[i] === q.answer).length;
  const passed = valuesCorrect === 5 && (totalCorrect / questions.length) >= 0.75;
  const valuesScore = Math.round((valuesCorrect / valuesQuestions.length) * 100);
  const governmentScore = Math.round((governmentCorrect / governmentQuestions.length) * 100);
  const beliefsScore = Math.round((beliefsCorrect / beliefsQuestions.length) * 100);
  const peopleScore = Math.round((peopleCorrect / peopleQuestions.length) * 100);
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

  // Intercept browser navigation (back/close) if test not completed
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!completed) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave the test? Your progress will be lost.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [completed]);

  // Intercept Next.js router navigation (push, replace, back)
  useEffect(() => {
    // Listen for browser back/forward
    const handlePopState = (event: PopStateEvent) => {
      if (!completed) {
        setShowExitConfirm(true);
        setPendingExitUrl(null); // null means just go back
        window.history.pushState(null, '', window.location.href); // Prevent pop
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [completed]);

  const handleExit = () => {
    setShowExitConfirm(true);
    setPendingExitUrl("/dashboard");
  };
  const confirmExit = () => {
    setShowExitConfirm(false);
    if (pendingExitUrl) {
      router.push(pendingExitUrl);
    } else {
      window.history.back();
    }
  };
  const cancelExit = () => {
    setShowExitConfirm(false);
    setPendingExitUrl(null);
  };

  // Modify the Rating component to store feedback
  const handleRatingSubmit = async (rating: number, comment: string) => {
    try {
      const testType = (mode || 'sequential') as TestType;
      const testNum = typeof testId === 'string' ? parseInt(testId, 10) : Number(testId);
      
      const result: Partial<TestResult> = {
        test_id: testNum,
        feedback_rating: rating,
        feedback_comment: comment,
        passed: passed
      };

      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType,
          result
        })
      });

      if (!response.ok) {
        throw new Error('Failed to store feedback');
      }
    } catch (error) {
      console.error('Error storing feedback:', error);
      toast.error('Failed to save feedback. Please try again later.');
    }
  };

  if (completed) {
    // Parse testId as number for navigation
    const testNum = typeof testId === 'string' ? parseInt(testId, 10) : Number(testId);
    const prevTest = testNum > 1 ? testNum - 1 : null;
    const nextTest = testNum < 20 ? testNum + 1 : null;
    const testType = mode || 'sequential';
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-3xl mx-auto p-6 bg-card rounded shadow">
            <h2 className="text-2xl font-bold mb-4 capitalize">{` ${testType} Practice Test ${testId} Completed`}</h2>
            <div className="mb-4 border border-border rounded-md p-4">
              <p>You answered {totalCorrect} out of {questions.length} questions correctly.</p>
              <span className="font-semibold">Score:</span>&nbsp;
              <span className="font-semibold">{score}%</span>
              <div>
              {passed ? (
                <span className="text-green-600 font-semibold">You Passed!</span>
              ) : (
                <span className="text-red-600 font-semibold">You Did Not Pass</span>
              )}
            </div>
            </div>
            <div className="mb-4 border border-border rounded-md p-4">
            <div className="mb-2">
              <span className="font-semibold">Australian Values Questions</span>&nbsp;&#8209;&nbsp;
              <span>Correct:</span>&nbsp;
              <span className="font-semibold">{valuesCorrect} / {valuesQuestions.length}</span>&nbsp;&#8209;&nbsp;
              <span className="font-semibold">{valuesScore}%</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Australian Government Questions</span>&nbsp;&#8209;&nbsp;
              <span>Correct:</span>&nbsp;
              <span className="font-semibold">{governmentCorrect} / {governmentQuestions.length}</span>&nbsp;&#8209;&nbsp;
              <span className="font-semibold">{governmentScore}%</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Australian Beliefs Questions</span>&nbsp;&#8209;&nbsp;
              <span>Correct:</span>&nbsp;
              <span className="font-semibold">{beliefsCorrect} / {beliefsQuestions.length}</span>&nbsp;&#8209;&nbsp;
              <span className="font-semibold">{beliefsScore}%</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Australian Peoples Questions</span>&nbsp;&#8209;&nbsp;
              <span>Correct:</span>&nbsp;
              <span className="font-semibold">{peopleCorrect} / {peopleQuestions.length}</span>&nbsp;&#8209;&nbsp;
              <span className="font-semibold">{peopleScore}%</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Time Used:</span>&nbsp; 
              <span className="font-mono">{timeStr}</span>
            </div>
            </div>
            {/* Navigation Buttons */}
            <div className="flex gap-2 mb-4">
              <Button asChild>
                <a href={`/tests/${testType}/${testNum}`}>Retake Test</a>
              </Button>
              <Button asChild disabled={!prevTest} variant="outline">
                <a href={prevTest ? `/tests/${testType}/${prevTest}` : undefined}>Previous Test</a>
              </Button>
              <Button asChild disabled={!nextTest} variant="outline">
                <a href={nextTest ? `/tests/${testType}/${nextTest}` : undefined}>Next Test</a>
              </Button>
            </div>
            <div className="mb-4 border border-border rounded-md p-4">
              {!isPremium && upgradePriceId && (
                <div className="mb-4">
                  <p>Upgrade to Premium to unlock all questions!</p>
                  <SubscribeButton priceId={upgradePriceId} label="Upgrade Now" />
                </div>
              )}
            </div>
            <div className="mb-4 border border-border rounded-md p-4">
              <SocialShare title="Citizenship Practice Test" link={typeof window !== 'undefined' ? window.location.href : ''} score={score} time={timeStr} />
            </div>
            <div className="mb-4 border border-border rounded-md p-4">
              <Rating onSubmit={handleRatingSubmit} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HUD: Previous Test Stats */}
      {testResult && (
        <Card className="mb-6 shadow-md border bg-card/90">
          <CardContent className="flex flex-wrap items-center gap-6 py-4 px-6 justify-between">
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">SCORE</span>
              <span className={`text-2xl font-bold ${testResult.score_percent >= 75 ? 'text-green-500' : 'text-red-500'}`}>{testResult.score_percent}%</span>
            </div>
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">ATTEMPTS</span>
              <span className="text-xl font-semibold">{testResult.attempt_count}</span>
            </div>
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">STATUS</span>
              <span className={`text-base px-3 py-1 rounded-full font-bold ${testResult.passed ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>{testResult.passed ? 'Passed' : 'Failed'}</span>
            </div>
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">BEST TIME</span>
              <span className="text-lg font-mono">{testResult.time_used_seconds ? `${Math.floor(testResult.time_used_seconds/60)}:${(testResult.time_used_seconds%60).toString().padStart(2,'0')}` : '--:--'}</span>
            </div>
            {testResult.last_attempted && (
              <div className="flex flex-col items-center min-w-[120px]">
                <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">LAST ATTEMPTED</span>
                <span className="text-sm font-medium" title={format(new Date(testResult.last_attempted), 'PPpp')}>
                  {formatDistanceToNow(new Date(testResult.last_attempted), { addSuffix: true })}
                </span>
              </div>
            )}
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">VALUES</span>
              <span className="text-lg font-semibold">{testResult.values_percent}%</span>
            </div>
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">GOVT</span>
              <span className="text-lg font-semibold">{testResult.government_percent}%</span>
            </div>
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">BELIEFS</span>
              <span className="text-lg font-semibold">{testResult.beliefs_percent}%</span>
            </div>
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-xs font-medium text-muted-foreground tracking-widest mb-1">PEOPLE</span>
              <span className="text-lg font-semibold">{testResult.people_percent}%</span>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center justify-center p-2">
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
              {/* Always show category for guided mode, otherwise only for values */}
              {(mode === 'guided') && (
                <div className={
                  questions[current].category === "values"
                    ? "text-sm text-orange-400 font-semibold mb-1"
                    : "text-sm text-blue-400 font-semibold mb-1"
                }>
                  {questions[current].category.charAt(0).toUpperCase() + questions[current].category.slice(1)} Question
                </div>
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
            category={mode === 'guided' ? questions[current].category : undefined}
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
            />
          </div>
          {/* Row 3: Exit / Submit */}
          <div className="flex items-center justify-between mt-6 w-full">
            <Button variant="outline" onClick={handleExit}>Exit Test</Button>
            <Button
              variant="secondary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
          {/* Exit Confirmation Dialog */}
          <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exit Test?</DialogTitle>
              </DialogHeader>
              <div>Are you sure you want to exit the test? Your progress will be lost.</div>
              <DialogFooter>
                <Button variant="outline" onClick={cancelExit}>Cancel</Button>
                <Button variant="destructive" onClick={confirmExit}>Exit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Submit Confirmation Dialog */}
          <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Test?</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>Are you sure you want to submit your test?</p>
                <p className="text-muted-foreground mt-2">
                  You have answered {answers.filter(a => a !== undefined).length} out of {questions.length} questions.
                  {review.some(r => r) && (
                    <span className="block mt-1 text-orange-400">
                      Note: You have questions marked for review.
                    </span>
                  )}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCancelSubmit}>Continue Test</Button>
                <Button onClick={handleConfirmSubmit}>Submit Test</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {showToast && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-2 rounded shadow z-50">
              Upgrade to Premium to unlock all questions and get an appropriate breakdown of your test results!
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
} 