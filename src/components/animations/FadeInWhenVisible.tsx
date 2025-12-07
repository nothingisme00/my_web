'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}

/**
 * Fade in animation triggered when element enters viewport
 * Perfect for scroll-triggered animations
 */
export function FadeInWhenVisible({ 
  children, 
  delay = 0, 
  className,
  once = true 
}: FadeInWhenVisibleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
