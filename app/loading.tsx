export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] w-full text-center">
      <div className="w-48 h-3 rounded bg-muted animate-pulse mb-6" />
      <div className="text-lg text-muted-foreground">Loading...</div>
    </div>
  );
} 