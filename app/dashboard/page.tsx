import { createSupabaseServerClient } from '../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import { fetchTestTypeAverages } from '../../lib/testResults';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { BarChart2, BookOpen, Shuffle, ListChecks, TrendingUp, CheckCircle2, Repeat2, PercentCircle, LayoutGrid, Users, Landmark, HeartHandshake, UserCheck } from 'lucide-react';
import Link from 'next/link';
import RefreshSessionOnCheckout from "../../components/dashboard/RefreshSessionOnCheckout";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch averages for all types
  const guided = await fetchTestTypeAverages(user.id, 'guided');
  const sequential = await fetchTestTypeAverages(user.id, 'sequential');
  const random = await fetchTestTypeAverages(user.id, 'random');

  // Compute overall average (only from types with data)
  const all = [guided, sequential, random].filter((t): t is NonNullable<typeof guided> => Boolean(t));
  const overall = all.length > 0 ? {
    avgScore: Math.round(all.reduce((sum, t) => sum + t.avgScore, 0) / all.length),
    avgAttempts: '-',
    passRate: Math.round(all.reduce((sum, t) => sum + t.passRate, 0) / all.length),
    avgValues: Math.round(all.reduce((sum, t) => sum + t.avgValues, 0) / all.length),
    avgGovernment: Math.round(all.reduce((sum, t) => sum + t.avgGovernment, 0) / all.length),
    avgBeliefs: Math.round(all.reduce((sum, t) => sum + t.avgBeliefs, 0) / all.length),
    avgPeople: Math.round(all.reduce((sum, t) => sum + t.avgPeople, 0) / all.length),
    totalAttempts: all.reduce((sum, t) => sum + t.totalAttempts, 0),
    totalTests: all.reduce((sum, t) => sum + t.totalTests, 0)
  } : null;

  type Stats = {
    avgScore: number;
    avgAttempts: string;
    passRate: number;
    avgValues: number;
    avgGovernment: number;
    avgBeliefs: number;
    avgPeople: number;
    totalTests: number;
    totalAttempts: number;
  };

  // Section 1: Performance Stats Widgets
  function PerfWidget({ title, icon, value, color, description }: { title: string; icon: React.ReactNode; value: React.ReactNode; color?: string; description?: string }) {
    return (
      <Card className="flex flex-col gap-2 items-center justify-center py-6 px-4 min-w-[180px]">
        <div className={`rounded-full p-2 mb-2 ${color || 'bg-muted text-muted-foreground'}`}>{icon}</div>
        <CardTitle className="text-base font-semibold mb-1 text-center">{title}</CardTitle>
        <div className="text-2xl font-bold mb-1 text-center">{value}</div>
        {description && <div className="text-xs text-muted-foreground text-center">{description}</div>}
      </Card>
    );
  }

  // Section 2: Category Averages Widgets
  function CategoryWidget({ title, icon, value, color }: { title: string; icon: React.ReactNode; value: React.ReactNode; color?: string }) {
    return (
      <Card className="flex flex-row items-center gap-4 py-4 px-4 min-w-[180px]">
        <div className={`rounded-full p-2 ${color || 'bg-muted text-muted-foreground'}`}>{icon}</div>
        <div>
          <CardTitle className="text-base font-semibold mb-1">{title}</CardTitle>
          <div className="text-xl font-bold">{value}</div>
        </div>
      </Card>
    );
  }

  // CTA Buttons (separated)
  function CTAWidget({ label, href, icon, color }: { label: string; href: string; icon: React.ReactNode; color?: string }) {
    return (
      <Card className={`flex flex-col items-center justify-center py-4 px-4 min-w-[180px] border-0 shadow-none bg-transparent`}> 
        <Button variant="secondary" className={`w-full ${color || ''}`}> <Link href={href} className="flex items-center gap-2">{icon}{label}</Link> </Button>
      </Card>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 px-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <RefreshSessionOnCheckout />
      </div>
      {/* Section 1: Performance Stats */}
      <div className="mb-2">
        <div className="text-lg font-semibold mb-4">Performance Overview</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PerfWidget title="Overall Score" icon={<TrendingUp className="w-6 h-6" />} value={overall ? `${overall.avgScore}%` : '--'} color="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200" description="Average across all types" />
          <PerfWidget title="Pass Rate" icon={<CheckCircle2 className="w-6 h-6" />} value={overall ? `${overall.passRate}%` : '--'} color="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200" description="% of tests passed" />
          <PerfWidget title="Total Attempts" icon={<Repeat2 className="w-6 h-6" />} value={overall ? overall.totalAttempts : '--'} color="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200" description="All test attempts" />
          <PerfWidget title="Total Tests" icon={<LayoutGrid className="w-6 h-6" />} value={overall ? overall.totalTests : '--'} color="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200" description="Unique tests taken" />
        </div>
      </div>
      {/* Section 2: Category Averages */}
      <div>
        <div className="text-lg font-semibold mb-4">Category Averages</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <CategoryWidget title="Values" icon={<HeartHandshake className="w-6 h-6" />} value={overall ? `${overall.avgValues}%` : '--'} color="bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200" />
          <CategoryWidget title="Government" icon={<Landmark className="w-6 h-6" />} value={overall ? `${overall.avgGovernment}%` : '--'} color="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200" />
          <CategoryWidget title="Beliefs" icon={<UserCheck className="w-6 h-6" />} value={overall ? `${overall.avgBeliefs}%` : '--'} color="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200" />
          <CategoryWidget title="People" icon={<Users className="w-6 h-6" />} value={overall ? `${overall.avgPeople}%` : '--'} color="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200" />
        </div>
        <div className="flex flex-wrap gap-4 justify-end">
          <CTAWidget label="Start Guided Test" href="/guided" icon={<BookOpen className="w-5 h-5" />} color="" />
          <CTAWidget label="Start Sequential Test" href="/sequential" icon={<ListChecks className="w-5 h-5" />} color="" />
          <CTAWidget label="Start Random Test" href="/random" icon={<Shuffle className="w-5 h-5" />} color="" />
        </div>
      </div>
    </div>
  );
} 