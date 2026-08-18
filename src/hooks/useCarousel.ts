import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCarouselResult {
  index: number;
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  setPaused: (paused: boolean) => void;
}

export function useCarousel(length: number, autoplayMs = 0): UseCarouselResult {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % length), [length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + length) % length), [length]);
  const goTo = useCallback((i: number) => setIndex(i % length), [length]);

  useEffect(() => {
    if (!autoplayMs || paused) return;
    timerRef.current = setInterval(next, autoplayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, autoplayMs, paused]);

  return { index, next, prev, goTo, setPaused };
}
