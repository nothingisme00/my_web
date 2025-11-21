'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypewriterText({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 3000,
  className = '',
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const handleTyping = () => {
      if (isPaused) {
        // Pause phase - wait before deleting
        const pauseTimer = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
        return () => clearTimeout(pauseTimer);
      }

      if (!isDeleting) {
        // Typing phase
        if (currentText.length < currentWord.length) {
          const typingTimer = setTimeout(() => {
            setCurrentText(currentWord.substring(0, currentText.length + 1));
          }, typingSpeed);
          return () => clearTimeout(typingTimer);
        } else {
          // Finished typing, start pause
          setIsPaused(true);
        }
      } else {
        // Deleting phase
        if (currentText.length > 0) {
          const deletingTimer = setTimeout(() => {
            setCurrentText(currentWord.substring(0, currentText.length - 1));
          }, deletingSpeed);
          return () => clearTimeout(deletingTimer);
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const cleanup = handleTyping();
    return cleanup;
  }, [currentText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
