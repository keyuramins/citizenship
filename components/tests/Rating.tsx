"use client";
import { useState } from "react";
import { Button } from "../ui/button";

export default function Rating({ onSubmit }: { onSubmit?: (rating: number) => void }) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (onSubmit) onSubmit(rating);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant={star <= rating ? "default" : "outline"}
            size="icon"
            onClick={() => handleRate(star)}
            disabled={submitted}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <span className="text-xl">★</span>
          </Button>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={submitted || rating === 0}>
        {submitted ? "Thank you!" : "Submit Rating"}
      </Button>
    </div>
  );
} 