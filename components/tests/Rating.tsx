"use client";
import { useState } from "react";
import { Button } from "../ui/button";

export default function Rating({ onSubmit }: { onSubmit?: (rating: number, message: string) => void }) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (onSubmit) onSubmit(rating, message);
  };

  return (
    <div className="flex flex-col items-center mt-4 w-full max-w-xs mx-auto border border-border rounded-md p-4">
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant={star <= rating ? "default" : "outline"}
            size="icon"
            onClick={() => handleRate(star)}
            disabled={submitted}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            className="focus:outline-none"
          >
            <span className={star <= rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>★</span>
          </Button>
        ))}
      </div>
      <textarea
        className="w-full p-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-2 resize-none"
        rows={3}
        placeholder="Add a comment (optional)"
        value={message}
        onChange={e => setMessage(e.target.value)}
        disabled={submitted}
        maxLength={300}
      />
      <Button onClick={handleSubmit} disabled={submitted || rating === 0} className="w-full">
        {submitted ? "Thank you!" : "Submit Rating"}
      </Button>
    </div>
  );
} 