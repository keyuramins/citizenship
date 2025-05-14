"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";

interface TestQuestion {
  question: string;
  options: string[];
  answer: string;
  category: string;
  explanation: string;
}

type Test = TestQuestion[];

interface PracticeTestsTabsProps {
  sequentialTests: Test[];
  randomizedTests: Test[];
}

// Dummy user access logic (replace with real Supabase logic)
function useIsPremiumUser() {
  // TODO: Replace with real Supabase user fetch
  const [isPremium, setIsPremium] = useState(false);
  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => setIsPremium(false), 100); // Change to true for premium
  }, []);
  return isPremium;
}

export default function PracticeTestsTabs({ sequentialTests, randomizedTests }: PracticeTestsTabsProps) {
  const [tab, setTab] = useState("sequential");
  const isPremium = useIsPremiumUser();

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="sequential">Sequential</TabsTrigger>
        <TabsTrigger value="random">Random</TabsTrigger>
      </TabsList>
      <TabsContent value="sequential">
        <PracticeTestGrid tests={sequentialTests} isPremium={isPremium} />
      </TabsContent>
      <TabsContent value="random">
        <PracticeTestGrid tests={randomizedTests} isPremium={isPremium} />
      </TabsContent>
    </Tabs>
  );
}

function PracticeTestGrid({ tests, isPremium }: { tests: Test[]; isPremium: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tests.map((test, i) => {
        const isFree = i < 5;
        const locked = !isPremium && !isFree;
        return (
          <div key={i} className="border rounded-lg p-4 bg-card relative">
            <div className="font-semibold text-lg mb-1">Practice Test {i + 1}</div>
            <div className="text-sm text-muted-foreground mb-4">
              Citizenship practice test with 20 randomized questions.
            </div>
            {locked ? (
              <Button variant="secondary" disabled className="w-full">Premium Only</Button>
            ) : (
              <Button className="w-full">Start Test</Button>
            )}
          </div>
        );
      })}
    </div>
  );
} 