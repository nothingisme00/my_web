'use client';

import { useState, useEffect, useCallback } from 'react';
import { Quote } from 'lucide-react';
import { FadeInWhenVisible } from '@/components/animations';

const quotes = [
  {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    role: "Co-founder of Apple"
  },
  {
    text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
    author: "Albert Einstein",
    role: "Theoretical Physicist"
  },
  {
    text: "When something is important enough, you do it even if the odds are not in your favor.",
    author: "Elon Musk",
    role: "CEO of Tesla & SpaceX"
  }
];

export function QuotesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 600);
    }, 400);
  }, [isAnimating, currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % quotes.length);
          setTimeout(() => setIsAnimating(false), 600);
        }, 400);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <FadeInWhenVisible>
      <div className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Quote Icon */}
          <div className="flex justify-center mb-10">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
              <Quote className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          {/* Fixed Height Container */}
          <div className="relative h-[280px] md:h-[240px] lg:h-[220px] flex items-center justify-center">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  index === currentIndex
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <blockquote className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 leading-relaxed mb-8 font-light italic max-w-3xl">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>

                <div className="space-y-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-white tracking-wide">
                    — {quote.author}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    {quote.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-10">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  index === currentIndex
                    ? 'bg-gray-800 dark:bg-white w-8'
                    : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </FadeInWhenVisible>
  );
}
