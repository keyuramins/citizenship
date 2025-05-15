interface PaginationProps {
  total: number;
  current: number;
  onNavigate: (index: number) => void;
}

export function Pagination({ total, current, onNavigate }: PaginationProps) {
  return (
    <div className="flex space-x-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`w-8 h-8 rounded ${i === current ? 'bg-green-600 text-white' : 'bg-gray-800 text-white border border-gray-700'}`}
          onClick={() => onNavigate(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
} 