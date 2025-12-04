"use client";

import React, { useRef, useState, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";

interface StripeCardProps {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  rotateIntensity?: number;
  glareOpacity?: number;
  borderRadius?: string;
}

export function StripeCard({
  children,
  className = "",
  glareColor = "rgba(255, 255, 255, 0.3)",
  rotateIntensity = 4,
  glareOpacity = 0.2,
  borderRadius = "1rem",
}: StripeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate rotation based on mouse position relative to center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Normalize and apply intensity (reduced for subtlety)
    const normalizedX = mouseX / (rect.width / 2);
    const normalizedY = mouseY / (rect.height / 2);

    setRotateY(normalizedX * rotateIntensity);
    setRotateX(-normalizedY * rotateIntensity);

    // Calculate glare position (percentage)
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{
        type: "tween",
        duration: 0.15,
        ease: "easeOut",
      }}>
      {/* Card content */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ borderRadius }}>
        {children}

        {/* Glare effect overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, transparent 60%)`,
          }}
          animate={{
            opacity: isHovered ? glareOpacity : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Border highlight on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius,
            boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.1)`,
          }}
          animate={{
            boxShadow: isHovered
              ? `inset 0 0 0 1px rgba(255, 255, 255, 0.2), 0 20px 40px -10px rgba(0, 0, 0, 0.3)`
              : `inset 0 0 0 1px rgba(255, 255, 255, 0.1)`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

// Wrapper for existing cards with simpler integration
interface StripeHoverWrapperProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function StripeHoverWrapper({
  children,
  className = "",
  disabled = false,
}: StripeHoverWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
  });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Reduced rotation intensity for subtler effect
    const rotateY = (mouseX / (rect.width / 2)) * 3;
    const rotateX = -(mouseY / (rect.height / 2)) * 3;

    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;

    setTransform({ rotateX, rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.1 });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={wrapperRef}
      className={`relative ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
      }}
      transition={{
        type: "tween",
        duration: 0.15,
        ease: "easeOut",
      }}>
      {children}
      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.25) 0%, transparent 50%)`,
          opacity: glare.opacity,
        }}
      />
    </motion.div>
  );
}
