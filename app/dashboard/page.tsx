import { generateSequentialTests } from "../../lib/generateSequentialTests";
import { generateRandomizedTests } from "../../lib/generateRandomizedTests";
import PracticeTestsTabs from "../../components/dashboard/PracticeTestsTabs";

export default async function DashboardPage() {
  // Generate all tests server-side
  const sequentialTests = await generateSequentialTests();
  const randomizedTests = await generateRandomizedTests();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <PracticeTestsTabs sequentialTests={sequentialTests} randomizedTests={randomizedTests} />
    </div>
  );
} 