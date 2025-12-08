'use client';

import { ArrowUp } from 'lucide-react';
import { motion, useMotionValueEvent, AnimatePresence, useScroll } from 'framer-motion';
import { useState } from 'react';

export function ScrollToTop() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 md:bottom-12 md:right-12 z-50 w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          style={{
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
