'use client';

import { useAnimationFrame } from 'framer-motion';
import { useEffect, useRef } from 'react';

const CHARS = 'qwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*()_+';
const CURSOR_PATTERN = '░▒▓█';

interface ScrambleTextProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export function ScrambleText({
  children,
  className,
  duration = 500,
  delay = 0,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const originalText = children;

  // Animation state
  const isAnimating = useRef(false);
  const startTime = useRef<number | null>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTickTime = useRef<number>(0);

  const initAudio = () => {
    if (typeof window !== 'undefined') {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    }
  };

  const handleInteraction = () => {
    initAudio();
    startAnimation();
  };

  const startAnimation = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    startTime.current = null;
    initAudio(); // Try initializing here if not blocked
  };

  const playTick = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === 'suspended') return;

    const now = ctx.currentTime;
    // Throttle the sound to avoid distortion/overlapping too much (play every ~40ms)
    if (now - lastTickTime.current < 0.04) return;
    lastTickTime.current = now;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Create a smooth, "creamy" mechanical keyboard click / soft thock effect
      osc.type = 'sine'; // Sine is the smoothest waveform

      // The rapid pitch drop creates a soft percussive "click" transient
      osc.frequency.setValueAtTime(400 + Math.random() * 100, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);

      // Smooth volume envelope to avoid harsh popping
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.005); // Soft attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04); // Fast decay

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Ignore any audio errors
    }
  };

  useAnimationFrame((time) => {
    if (!isAnimating.current || !ref.current) return;
    if (startTime.current === null) startTime.current = time;

    const elapsed = time - startTime.current;
    const progress = Math.min(elapsed / duration, 1);

    const length = originalText.length;
    let nextStr = '';
    let isScrambling = false;

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
        isScrambling = true;
      } else {
        nextStr += CHARS[Math.floor(Math.random() * CHARS.length)];
        isScrambling = true;
      }
    }

    ref.current.innerText = nextStr;

    if (isScrambling) {
      playTick();
    }

    if (progress === 1) {
      isAnimating.current = false;
      ref.current.innerText = originalText;
    }
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (delay > 0) {
      timeout = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [delay]); // Initial animation

  return (
    <span
      ref={ref}
      className={className}
      onPointerEnter={handleInteraction}
      onPointerDown={handleInteraction}
    >
      <span className="opacity-0">{children}</span>
    </span>
  );
}
