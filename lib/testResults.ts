// lib/testResults.ts
import { createSupabaseServerClient } from './supabaseClient';
import { TestResult, TestType } from './types';

export async function storeTestResult(userId: string, email: string, fullName: string, testType: TestType, result: TestResult) {
  const supabase = await createSupabaseServerClient();

  // First, try to get existing record
  const { data: existingRecord } = await supabase
    .from('test_summary')
    .select()
    .eq('user_id', userId)
    .single();

  // Initialize the results array for this test type
  const resultsField = `${testType}_results`;
  const existingResults = existingRecord?.[resultsField] || [];

  // Find if there's an existing result for this test_id
  const existingIndex = existingResults.findIndex((r: TestResult) => r.test_id === result.test_id);

  let updatedResults: TestResult[];
  if (existingIndex === -1) {
    // No existing result for this test_id, add new result
    updatedResults = [...existingResults, { ...result, last_attempted: new Date().toISOString() }];
  } else {
    // Found existing result, calculate averages
    const existingResult = existingResults[existingIndex];
    const newAttemptCount = existingResult.attempt_count + 1;

    const averagedResult: TestResult = {
      test_id: result.test_id,
      attempt_count: newAttemptCount,
      correct_answers: Math.round((existingResult.correct_answers * existingResult.attempt_count + result.correct_answers) / newAttemptCount),
      score_percent: Math.round((existingResult.score_percent * existingResult.attempt_count + result.score_percent) / newAttemptCount),
      values_correct: Math.round((existingResult.values_correct * existingResult.attempt_count + result.values_correct) / newAttemptCount),
      government_correct: Math.round((existingResult.government_correct * existingResult.attempt_count + result.government_correct) / newAttemptCount),
      beliefs_correct: Math.round((existingResult.beliefs_correct * existingResult.attempt_count + result.beliefs_correct) / newAttemptCount),
      people_correct: Math.round((existingResult.people_correct * existingResult.attempt_count + result.people_correct) / newAttemptCount),
      values_percent: Math.round((existingResult.values_percent * existingResult.attempt_count + result.values_percent) / newAttemptCount),
      government_percent: Math.round((existingResult.government_percent * existingResult.attempt_count + result.government_percent) / newAttemptCount),
      beliefs_percent: Math.round((existingResult.beliefs_percent * existingResult.attempt_count + result.beliefs_percent) / newAttemptCount),
      people_percent: Math.round((existingResult.people_percent * existingResult.attempt_count + result.people_percent) / newAttemptCount),
      time_used_seconds: Math.round((existingResult.time_used_seconds * existingResult.attempt_count + result.time_used_seconds) / newAttemptCount),
      // For passed, we'll keep track of the most recent pass/fail status
      passed: result.passed,
      // Keep the latest feedback if provided
      feedback_rating: result.feedback_rating || existingResult.feedback_rating,
      feedback_comment: result.feedback_comment || existingResult.feedback_comment,
      // Always update the last attempted timestamp
      last_attempted: new Date().toISOString()
    };

    // Replace the existing result with the averaged one
    updatedResults = [...existingResults];
    updatedResults[existingIndex] = averagedResult;
  }

  // Calculate pass/fail statistics for this test type
  const passFailStats = {
    total_attempts: updatedResults.reduce((sum, r) => sum + r.attempt_count, 0),
    total_passed: updatedResults.filter(r => r.passed).length,
    total_failed: updatedResults.filter(r => !r.passed).length,
    unique_tests_attempted: updatedResults.length,
    unique_tests_passed: updatedResults.filter(r => r.passed).length,
    unique_tests_failed: updatedResults.filter(r => !r.passed).length,
    average_score: Math.round(updatedResults.reduce((sum, r) => sum + r.score_percent, 0) / updatedResults.length)
  };

  // Prepare the upsert data
  const upsertData: Record<string, any> = {
    user_id: userId,
    email,
    full_name: fullName,
    updated_at: new Date().toISOString(),
    [`${testType}_results`]: passFailStats
  };

  // Add the specific test type results
  upsertData[resultsField] = updatedResults;

  // Upsert the record
  const { error } = await supabase
    .from('test_summary')
    .upsert(upsertData, { onConflict: 'user_id' });

  if (error) throw error;

  return passFailStats;
}

export async function fetchTestResultForTest(userId: string, testType: TestType, testId: number): Promise<TestResult | null> {
  const supabase = await createSupabaseServerClient();
  const { data: existingRecord } = await supabase
    .from('test_summary')
    .select()
    .eq('user_id', userId)
    .single();
  if (!existingRecord) return null;
  const resultsField = `${testType}_results`;
  const results = existingRecord[resultsField] || [];
  const result = results.find((r: TestResult) => r.test_id === testId);
  return result || null;
}

export async function fetchTestTypeAverages(userId: string, testType: TestType) {
  const supabase = await createSupabaseServerClient();
  const { data: existingRecord } = await supabase
    .from('test_summary')
    .select()
    .eq('user_id', userId)
    .single();
  if (!existingRecord) return null;
  const resultsField = `${testType}_results`;
  const results = existingRecord[resultsField] || [];
  if (!Array.isArray(results) || results.length === 0) return null;

  // Calculate averages
  const total = results.length;
  const sum = results.reduce((acc, r) => {
    acc.score += r.score_percent || 0;
    acc.attempts += r.attempt_count || 0;
    acc.passed += r.passed ? 1 : 0;
    acc.values += r.values_percent || 0;
    acc.government += r.government_percent || 0;
    acc.beliefs += r.beliefs_percent || 0;
    acc.people += r.people_percent || 0;
    return acc;
  }, { score: 0, attempts: 0, passed: 0, values: 0, government: 0, beliefs: 0, people: 0 });

  // Find the most recent attempt
  const lastAttempted = results.reduce((latest: string | null, r) => {
    if (!r.last_attempted) return latest;
    if (!latest) return r.last_attempted;
    return new Date(r.last_attempted) > new Date(latest) ? r.last_attempted : latest;
  }, null);

  return {
    avgScore: Math.round(sum.score / total),
    avgAttempts: (sum.attempts / total).toFixed(1),
    passRate: Math.round((sum.passed / total) * 100),
    avgValues: Math.round(sum.values / total),
    avgGovernment: Math.round(sum.government / total),
    avgBeliefs: Math.round(sum.beliefs / total),
    avgPeople: Math.round(sum.people / total),
    totalTests: total,
    totalAttempts: sum.attempts,
    lastAttempted
  };
} 