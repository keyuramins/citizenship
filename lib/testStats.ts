import { createSupabaseServerClient } from './supabaseClient';
import { TestResult, TestType } from './types';

export interface TestStats {
  lastAttempt: TestResult | null;
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  timesBestScore: number;
  averageTimeSeconds: number;
  bestTimeSeconds: number;
  categoryAverages: {
    values: number;
    government: number;
    beliefs: number;
    people: number;
  };
  passRate: number;
  lastAttemptDate?: string;
}

export async function getTestStats(userId: string, testType: TestType, testId: number): Promise<TestStats | null> {
  const supabase = await createSupabaseServerClient();

  // Fetch user's test summary
  const { data: testSummary } = await supabase
    .from('test_summary')
    .select()
    .eq('user_id', userId)
    .single();

  if (!testSummary) {
    return null;
  }

  // Get the results array for the specific test type
  const resultsField = `${testType}_results`;
  const allResults = testSummary[resultsField] || [];

  // Find all attempts for this specific test
  const testResults = allResults.filter((result: TestResult) => result.test_id === testId);

  if (testResults.length === 0) {
    return null;
  }

  // Calculate statistics
  const lastAttempt = testResults[testResults.length - 1];
  const scores = testResults.map((r: TestResult) => r.score_percent);
  const bestScore = Math.max(...scores);
  const averageScore = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
  const timesBestScore = scores.filter((score: number) => score === bestScore).length;

  // Calculate time statistics
  const times = testResults.map((r: TestResult) => r.time_used_seconds);
  const averageTimeSeconds = Math.round(times.reduce((a: number, b: number) => a + b, 0) / times.length);
  const bestTimeSeconds = Math.min(...times);

  // Calculate category averages
  const categoryAverages = {
    values: Math.round(testResults.reduce((sum: number, r: TestResult) => sum + r.values_percent, 0) / testResults.length),
    government: Math.round(testResults.reduce((sum: number, r: TestResult) => sum + r.government_percent, 0) / testResults.length),
    beliefs: Math.round(testResults.reduce((sum: number, r: TestResult) => sum + r.beliefs_percent, 0) / testResults.length),
    people: Math.round(testResults.reduce((sum: number, r: TestResult) => sum + r.people_percent, 0) / testResults.length)
  };

  // Calculate pass rate
  const passedAttempts = testResults.filter((r: TestResult) => r.passed).length;
  const passRate = Math.round((passedAttempts / testResults.length) * 100);

  return {
    lastAttempt,
    totalAttempts: testResults.length,
    bestScore,
    averageScore,
    timesBestScore,
    averageTimeSeconds,
    bestTimeSeconds,
    categoryAverages,
    passRate,
    lastAttemptDate: testSummary.updated_at
  };
} 