'use client';

import { useAnimationFrame } from 'framer-motion';
import { useEffect, useRef } from 'react';

const CHARS = 'qwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*()_+';
const CURSOR_PATTERN = '░▒▓█';

interface ScrambleTextProps {
  children: string;
  className?: string;
  duration?: number;
}

export function ScrambleText({
  children,
  className,
  duration = 500,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const originalText = children;

  // Animation state
  const isAnimating = useRef(false);
  const startTime = useRef<number | null>(null);

  const startAnimation = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    startTime.current = null;
  };

  useAnimationFrame((time) => {
    if (!isAnimating.current || !ref.current) return;
    if (startTime.current === null) startTime.current = time;

    const elapsed = time - startTime.current;
    const progress = Math.min(elapsed / duration, 1);

    const length = originalText.length;
    let nextStr = '';

    // Calculate a sweep effect
    for (let i = 0; i < length; i++) {
      // Individual character progress based on position in string
      // The further along the string, the later it starts settling
      const charProgress = Math.max(0, Math.min(progress * 2 - i / length, 1));

      if (originalText[i] === ' ' || originalText[i] === '\n') {
        nextStr += originalText[i];
        continue;
      }

      if (charProgress === 1) {
        nextStr += originalText[i];
      } else if (charProgress > 0.8) {
        nextStr +=
          CURSOR_PATTERN[Math.floor(Math.random() * CURSOR_PATTERN.length)];
      } else {
        nextStr += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }

    ref.current.innerText = nextStr;

    if (progress === 1) {
      isAnimating.current = false;
      ref.current.innerText = originalText;
    }
  });

  useEffect(() => {
    startAnimation();
  }, []); // Initial animation

  return (
    <span
      ref={ref}
      className={className}
      onPointerEnter={startAnimation}
      onPointerDown={startAnimation}
    >
      <span className="opacity-0">{children}</span>
    </span>
  );
}
