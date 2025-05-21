export interface TestResult {
  test_id: number;
  attempt_count: number;
  correct_answers: number;
  score_percent: number;
  values_correct: number;
  government_correct: number;
  beliefs_correct: number;
  people_correct: number;
  values_percent: number;
  government_percent: number;
  beliefs_percent: number;
  people_percent: number;
  time_used_seconds: number;
  passed: boolean;
  feedback_rating?: number;
  feedback_comment?: string;
  last_attempted?: string;
}

export type TestType = 'dashboard' | 'guided' | 'sequential' | 'random'; 