'use client';

import { useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollFloatProps {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

export const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1,
  ease = "back.out(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03
}: ScrollFloatProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const words = useMemo(() => children.split(" "), [children]);

  // Create a flattened array of characters with their global index to handle staggering across words
  const chars = useMemo(() => {
    const characters: { char: string; wordIndex: number; charIndex: number; globalIndex: number }[] = [];
    let globalIndex = 0;
    
    words.forEach((word, wordIndex) => {
      word.split("").forEach((char, charIndex) => {
        characters.push({ char, wordIndex, charIndex, globalIndex });
        globalIndex++;
      });
      // Add space as a character
      if (wordIndex < words.length - 1) {
        characters.push({ char: " ", wordIndex, charIndex: word.length, globalIndex });
        globalIndex++;
      }
    });
    return characters;
  }, [words]);

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
              // Calculate stagger delay based on character index
              // We use useTransform to map scroll progress to animation state
              // However, for a true "scroll float" effect where characters float up as you scroll,
              // we can map scrollYProgress to y position and opacity
              
              return (
                <Char 
                  key={charIndex}
                  char={char}
                  progress={scrollYProgress}
                  index={words.slice(0, wordIndex).join("").length + charIndex}
                  totalChars={children.length}
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

const Char = ({ char, progress, index, totalChars, stagger }: { char: string; progress: any; index: number; totalChars: number; stagger: number }) => {
  // Calculate the start and end points for this specific character's animation
  // The animation should start when the element enters the viewport
  
  // We want a wave effect, so we offset the start/end based on index
  const start = index * (0.5 / totalChars);
  const end = start + 0.5; // Animation duration relative to scroll
  
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
