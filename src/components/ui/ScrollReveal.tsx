'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  rotationStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
}

export const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  rotationStrength = 20,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1,
  ease = "circOut",
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to opacity
  // 0 (start) -> 0.1 (baseOpacity)
  // 0.5 (center) -> 1 (fully visible)
  // 1 (end) -> 0.1 (baseOpacity)
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [baseOpacity, 1, baseOpacity]
  );

  // Transform scroll progress to rotation
  // 0 -> baseRotation
  // 0.5 -> 0
  // 1 -> -baseRotation
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [baseRotation, 0, -baseRotation]
  );

  // Transform scroll progress to blur
  // 0 -> blurStrength
  // 0.5 -> 0
  // 1 -> blurStrength
  const blur = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [blurStrength, 0, blurStrength]
  );

  // Apply spring physics for smoother animation
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 20 });
  const smoothRotate = useSpring(rotate, { stiffness: 100, damping: 20 });
  const smoothBlur = useSpring(blur, { stiffness: 100, damping: 20 });

  return (
    <h2
      ref={containerRef}
      className={`my-5 overflow-hidden ${containerClassName}`}
    >
      <motion.div
        className={textClassName}
        style={{
          opacity: smoothOpacity,
          rotate: smoothRotate,
          filter: enableBlur ? useTransform(smoothBlur, (v) => `blur(${v}px)`) : "none",
        }}
      >
        {children}
      </motion.div>
    </h2>
  );
};
