'use client';

import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export const ScrollReveal = ({
  children,
  className = "",
}: ScrollRevealProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
