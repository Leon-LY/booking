"use client";

import { useEffect, useState, useRef } from "react";
import { easeOutExpo } from "@/lib/utils";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ target, suffix = "", duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return (
    <div ref={ref} className="text-3xl font-bold text-primary">
      {count}{suffix}
    </div>
  );
}
