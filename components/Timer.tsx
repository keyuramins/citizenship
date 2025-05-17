import { Clock } from "lucide-react";

interface TimerProps {
  seconds: number;
}

export function Timer({ seconds }: TimerProps) {
  const isDanger = seconds <= 300;
  const timeStr = new Date(seconds * 1000).toISOString().substr(11, 8);
  return (
    <div className={`font-mono text-lg flex items-center gap-2 ${isDanger ? 'text-red-500' : 'text-green-400'}`}>
      <Clock className={`w-5 h-5 ${isDanger ? 'text-red-500' : 'text-green-400'}`} />
      {timeStr}
    </div>
  );
} 