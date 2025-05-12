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
          className={`w-8 h-8 rounded-full border ${i === current ? 'bg-blue-500 text-white' : 'bg-white border-gray-300'}`}
          onClick={() => onNavigate(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
} 