import { fetchQuestionsFromS3 } from "./fetchQuestionsFromS3";
import { duplicateToLength, chunk, shuffle } from "./testUtils";

const CATEGORIES = ["people", "values", "government", "beliefs"] as const;
type Category = typeof CATEGORIES[number];

export interface TestQuestion {
  question: string;
  options: string[];
  answer: string;
  category: string;
  explanation: string;
}

export type Test = TestQuestion[];

export async function generateRandomizedTests(): Promise<Test[]> {
  // Fetch all questions for each category
  const allQuestions: Record<Category, TestQuestion[]> = {
    people: await fetchQuestionsFromS3("people"),
    values: await fetchQuestionsFromS3("values"),
    government: await fetchQuestionsFromS3("government"),
    beliefs: await fetchQuestionsFromS3("beliefs"),
  };

  // Find the max number of 5-question groups possible (after duplication)
  const numGroups = Math.max(
    ...CATEGORIES.map(cat => Math.ceil(allQuestions[cat].length / 5))
  );
  const needed = numGroups * 5;

  // Duplicate and shuffle each category to needed length
  const expanded: Record<Category, TestQuestion[]> = {
    people: shuffle(duplicateToLength(allQuestions.people, needed)),
    values: shuffle(duplicateToLength(allQuestions.values, needed)),
    government: shuffle(duplicateToLength(allQuestions.government, needed)),
    beliefs: shuffle(duplicateToLength(allQuestions.beliefs, needed)),
  };

  // Chunk each into groups of 5
  const chunks: Record<Category, TestQuestion[][]> = {
    people: chunk(expanded.people, 5),
    values: chunk(expanded.values, 5),
    government: chunk(expanded.government, 5),
    beliefs: chunk(expanded.beliefs, 5),
  };

  // Assemble tests: for each group, take 5 from each category
  const tests: Test[] = [];
  for (let i = 0; i < numGroups; i++) {
    tests.push([
      ...chunks.people[i],
      ...chunks.values[i],
      ...chunks.government[i],
      ...chunks.beliefs[i],
    ]);
  }
  return shuffle(tests);
} 