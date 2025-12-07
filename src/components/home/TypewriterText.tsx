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
  typingSpeed = 50,
  deletingSpeed = 25,
  pauseDuration = 2000,
  className = '',
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Find the longest word for fixed width
  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b, '');

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const handleTyping = () => {
      if (isPaused) {
        const pauseTimer = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
        return () => clearTimeout(pauseTimer);
      }

      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          const typingTimer = setTimeout(() => {
            setCurrentText(currentWord.substring(0, currentText.length + 1));
          }, typingSpeed);
          return () => clearTimeout(typingTimer);
        } else {
          setIsPaused(true);
        }
      } else {
        if (currentText.length > 0) {
          const deletingTimer = setTimeout(() => {
            setCurrentText(currentWord.substring(0, currentText.length - 1));
          }, deletingSpeed);
          return () => clearTimeout(deletingTimer);
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const cleanup = handleTyping();
    return cleanup;
  }, [currentText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={`inline-block ${className}`} style={{ minWidth: `${longestWord.length}ch` }}>
      <span className="transition-opacity duration-150 ease-out">
        {currentText}
      </span>
      <span
        className={`transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
        style={{ marginLeft: '2px' }}
      >
        |
      </span>
    </span>
  );
}
