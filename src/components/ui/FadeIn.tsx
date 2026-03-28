"use client";

import { useFadeIn } from "@/hooks/useFadeIn";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3;
}

export function FadeIn({ children, className = "", delay }: FadeInProps) {
  const { ref, isVisible } = useFadeIn();

  return (
    <div
      ref={ref}
      className={`fade-in-up ${isVisible ? "visible" : ""} ${delay ? `delay-${delay}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}
