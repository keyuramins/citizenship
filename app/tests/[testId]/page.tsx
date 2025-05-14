// Next.js 15: params should be an object, not a Promise. Do not type as Promise<any>.
export default function TestPage({ params }: { params: { testId: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Practice Test: {params.testId}</h1>
      {/* TODO: Render questions, timer, and quiz logic */}
    </div>
  );
} 