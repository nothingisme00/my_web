'use client';

import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollFloatProps {
  children: string;
  containerClassName?: string;
  textClassName?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

export const ScrollFloat = ({
  children,
  containerClassName = "",
  textClassName = "",
  stagger = 0.03
}: ScrollFloatProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const words = useMemo(() => children.split(" "), [children]);

  return (
    <h2
      ref={containerRef}
      className={`my-5 overflow-hidden ${containerClassName}`}
    >
      <span className="sr-only">{children}</span>
      <span className={`flex flex-wrap ${textClassName}`}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="whitespace-nowrap mr-[0.2em] last:mr-0">
            {word.split("").map((char, charIndex) => {
              return (
                <Char 
                  key={charIndex}
                  char={char}
                  progress={scrollYProgress}
                  index={words.slice(0, wordIndex).join("").length + charIndex}
                  stagger={stagger}
                />
              );
            })}
          </span>
        ))}
      </span>
    </h2>
  );
};

const Char = ({ char, progress, index, stagger }: { char: string; progress: import('framer-motion').MotionValue<number>; index: number; stagger: number }) => {
  
  // Map scroll progress to opacity and y-transform
  // When progress is 0 (start), opacity is 0, y is 100%
  // When progress is 1 (end), opacity is 1, y is 0%
  
  // Actually, React Bits ScrollFloat typically animates IN as you scroll down
  // Let's make it simple: animate from y: 100% to y: 0% based on scroll
  
  const y = useTransform(
    progress,
    [0, 0.3 + (index * stagger)], // Start animation slightly staggered
    ['100%', '0%']
  );
  
  const opacity = useTransform(
    progress,
    [0, 0.3 + (index * stagger)],
    [0, 1]
  );

  return (
    <motion.span
      style={{ y, opacity }}
      className="inline-block"
    >
      {char}
    </motion.span>
  );
};
