'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ReadingProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const totalDocScrollLength = documentHeight - windowHeight;
      const scrollPosition = Math.min((scrollTop / totalDocScrollLength) * 100, 100);

      setScrollProgress(scrollPosition);
    };

    window.addEventListener('scroll', calculateScrollProgress);
    calculateScrollProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
      style={{ width: `${scrollProgress}%` }}
      initial={{ width: 0 }}
      transition={{ ease: "easeOut", duration: 0.1 }}
    />
  );
}
