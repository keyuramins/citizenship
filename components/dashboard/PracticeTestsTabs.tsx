"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import SubscribeButton from "../SubscribeButton";

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
  upgradePriceId: string;
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

export default function PracticeTestsTabs({ sequentialTests, randomizedTests, upgradePriceId }: PracticeTestsTabsProps) {
  const [tab, setTab] = useState("sequential");
  const isPremium = useIsPremiumUser();

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList>
          <TabsTrigger value="sequential">Sequential</TabsTrigger>
          <TabsTrigger value="random">Random</TabsTrigger>
        </TabsList>
        {!isPremium && (
          <SubscribeButton priceId={upgradePriceId} label="Upgrade Now" />
        )}
      </div>
      <TabsContent value="sequential">
        <PracticeTestGrid tests={sequentialTests} isPremium={isPremium} type="sequential" />
      </TabsContent>
      <TabsContent value="random">
        <PracticeTestGrid tests={randomizedTests} isPremium={isPremium} type="random" />
      </TabsContent>
    </Tabs>
  );
}

function PracticeTestGrid({ tests, isPremium, type }: { tests: Test[]; isPremium: boolean; type: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {tests.map((test, i) => {
        const isFree = i < 5;
        const locked = !isPremium && !isFree;
        return (
          <div key={i} className="border rounded-lg p-4 bg-card relative">
            <div className="font-semibold text-lg mb-1">Practice Test {i + 1}</div>
            <div className="text-sm text-muted-foreground mb-4">
              {type === "sequential" ? "Citizenship practice test with 20 sequential questions." : "Citizenship practice test with 20 randomized questions."}
            </div>
            {locked ? (
              <Button variant="secondary" disabled className="w-full">Premium Only</Button>
            ) : (
              <Button asChild className="w-full">
                <Link href={`/tests/${type}/${i + 1}`}>Start Test</Link>
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
} 