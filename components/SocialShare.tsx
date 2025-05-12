export function SocialShare({ title, link, score, time }: { title: string; link: string; score: number; time: string }) {
  return (
    <div className="flex space-x-2 mt-4">
      {/* TODO: Add WhatsApp, X (Twitter), and generic share buttons */}
      <button className="px-3 py-1 bg-green-500 text-white rounded">WhatsApp</button>
      <button className="px-3 py-1 bg-blue-500 text-white rounded">X</button>
      <button className="px-3 py-1 bg-gray-500 text-white rounded">Share</button>
    </div>
  );
} 