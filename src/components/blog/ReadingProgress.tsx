'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  // Smooth out the progress value
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Background track */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50" />
      
      {/* Progress bar - minimalist solid color with subtle shadow */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50 bg-blue-600 dark:bg-blue-400 shadow-sm"
        style={{ 
          scaleX,
          boxShadow: '0 1px 3px rgba(59, 130, 246, 0.3)'
        }}
      />
    </>
  );
}
