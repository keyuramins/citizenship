interface QuestionCardProps {
  question: string;
  options: string[];
  onAnswer: (option: string) => void;
  selectedOption?: string;
  correctOption?: string;
  explanation?: string;
}

export function QuestionCard({ question, options, onAnswer, selectedOption, correctOption, explanation }: QuestionCardProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{question}</h2>
      <div className="space-y-2">
        {options.map(option => (
          <button
            key={option}
            className={`w-full p-2 rounded border text-left ${selectedOption === option ? (option === correctOption ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400') : 'border-gray-300'}`}
            onClick={() => onAnswer(option)}
            disabled={!!selectedOption}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedOption && (
        <div className="mt-4 p-3 rounded bg-green-100 dark:bg-green-700 text-black dark:text-white">
          <span className="font-semibold">Explanation:</span> {explanation}
        </div>
      )}
    </div>
  );
} 