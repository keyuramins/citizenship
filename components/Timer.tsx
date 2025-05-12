interface TimerProps {
  seconds: number;
}

export function Timer({ seconds }: TimerProps) {
  // TODO: Implement countdown logic
  return (
    <div className="font-mono text-lg">
      {/* Format seconds as HH:MM:SS */}
      {new Date(seconds * 1000).toISOString().substr(11, 8)}
    </div>
  );
} 