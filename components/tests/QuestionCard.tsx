interface QuestionCardProps {
  question: string;
  options: string[];
  onAnswer: (option: string) => void;
  selectedOption?: string;
  correctOption?: string;
  explanation?: string;
  category?: string;
}
//This only shows the question, options and explanation. It does not show the timer or the navigation buttons.
export function QuestionCard({ question, options, onAnswer, selectedOption, correctOption, explanation, category }: QuestionCardProps) {
  return (
    <div className="mb-6">
      {category && (
        <div className="text-xs text-blue-400 font-semibold mb-1">
          {category.charAt(0).toUpperCase() + category.slice(1)} Question
        </div>
      )}
      <h2 className="text-lg font-semibold mb-2">{question}</h2>
      <div className="space-y-2">
        {options.map(option => (
          <button
            key={option}
            className={`w-full p-2 rounded border flex items-center text-left gap-3 ${selectedOption === option ? (option === correctOption ? 'bg-green-900 border-green-600' : 'bg-red-900 border-red-600') : 'border-gray-600'}`}
            onClick={() => onAnswer(option)}
            disabled={!!selectedOption}
          >
            <span className="flex items-center justify-center w-4 h-4 rounded-full border-2"
              style={{
                borderColor: selectedOption === option ? (option === correctOption ? '#22c55e' : '#ef4444') : '#d1d5db',
                background: selectedOption === option ? (option === correctOption ? '#bbf7d0' : '#fecaca') : 'transparent',
              }}
              aria-hidden="true"
            >
              {selectedOption === option ? (
                <span className={`block w-3 h-3 rounded-full ${option === correctOption ? 'bg-green-900 border border-green-600' : 'bg-red-900 border border-red-600'}`}></span>
              ) : null}
            </span>
            <span>{option}</span>
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