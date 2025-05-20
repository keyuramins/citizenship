"use client";

import { TestStats } from "../../lib/testStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Info } from "lucide-react";

interface TestStatisticsProps {
  stats: TestStats;
  testNumber: number;
}

export function TestStatistics({ stats, testNumber }: TestStatisticsProps) {
  // Format time from seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Test {testNumber} Statistics</CardTitle>
          <CardDescription>
            Based on {stats.totalAttempts} attempt{stats.totalAttempts !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scores */}
            <div className="space-y-2">
              <h3 className="font-semibold">Scores</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Best Score:</div>
                <div className="font-semibold">{stats.bestScore}%</div>
                <div>Average Score:</div>
                <div className="font-semibold">{stats.averageScore}%</div>
                <div>Pass Rate:</div>
                <div className="font-semibold">{stats.passRate}%</div>
                <div>Times Best Score:</div>
                <div className="font-semibold">{stats.timesBestScore}</div>
              </div>
            </div>

            {/* Times */}
            <div className="space-y-2">
              <h3 className="font-semibold">Time Performance</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Best Time:</div>
                <div className="font-semibold">{formatTime(stats.bestTimeSeconds)}</div>
                <div>Average Time:</div>
                <div className="font-semibold">{formatTime(stats.averageTimeSeconds)}</div>
              </div>
            </div>

            {/* Category Performance */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-semibold flex items-center gap-2">
                Category Performance
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average performance in each category across all attempts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Values</div>
                  <div className="text-2xl font-bold">{stats.categoryAverages.values}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Government</div>
                  <div className="text-2xl font-bold">{stats.categoryAverages.government}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Beliefs</div>
                  <div className="text-2xl font-bold">{stats.categoryAverages.beliefs}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">People</div>
                  <div className="text-2xl font-bold">{stats.categoryAverages.people}%</div>
                </div>
              </div>
            </div>

            {/* Last Attempt */}
            {stats.lastAttempt && (
              <div className="space-y-2 md:col-span-2">
                <h3 className="font-semibold">Last Attempt</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Score</div>
                    <div className="font-semibold">{stats.lastAttempt.score_percent}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Result</div>
                    <div className={`font-semibold ${stats.lastAttempt.passed ? 'text-green-500' : 'text-red-500'}`}>
                      {stats.lastAttempt.passed ? 'Passed' : 'Failed'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Time</div>
                    <div className="font-semibold">{formatTime(stats.lastAttempt.time_used_seconds)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Date</div>
                    <div className="font-semibold">
                      {stats.lastAttemptDate ? new Date(stats.lastAttemptDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 