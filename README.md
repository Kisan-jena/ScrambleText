# Anime.js Scramble Text Clone in Next.js

This project is a React-based replica of Anime.js's text scramble effect, built natively for a modern Next.js stack without relying on heavy third-party animation libraries like GSAP or Anime.js itself for the core effect.

## Tech Stack & Libraries Used

- **[Next.js (React)](https://nextjs.org/)**: The core framework for the application.
- **[Tailwind CSS](https://tailwindcss.com/)**: Used for utility-first, quick styling to match the original design perfectly (including typography and dark mode).
- **[Framer Motion](https://www.framer.com/motion/)**: We specifically leveraged its `useAnimationFrame` hook for an optimized, React-friendly requestAnimationFrame loop. It gives us a smooth, continuous time value without dealing with native raw `requestAnimationFrame` cleanup.

## The Concept

The "Scramble Text" effect creates a visual illusion where text looks like it's being actively decoded or typed out by a terminal. 
It sweeps across the block of text from left to right (or a custom direction). Ahead of the sweep, characters are invisible or randomized. At the sweep boundary, a specific 'cursor pattern' is shown (e.g., `░▒▓█`), and behind the sweep, the true characters settle into their final position.

## How We Implemented It

Instead of animating individual spans using complex DOM operations or heavy plugins, the effect is achieved purely through state/ref updates driven by a single render loop (`useAnimationFrame`):

1. **The `ScrambleText` Component**: A reusable React component that takes a `children` string.
2. **Progress Calculation**: We calculate a normalized `progress` value (`elapsed / duration` from 0 to 1).
3. **Per-Character Math**: For every frame, we iterate over the exact length of the original string. We assign a localized `charProgress` value to each character based on its index relative to the global string length. 
4. **Conditional Rendering Loop**:
    - If `charProgress` is at 100%: We render the **actual original character**.
    - If `charProgress` is very close to 100% (e.g. > 0.8): We render a blocky **cursor character** (`░▒▓█`).
    - If `charProgress` is lower: We render a **random alphanumeric/symbol character**.
5. **DOM Update**: We directly mutate the `ref.current.innerText` with the newly concatenated string on every frame. This bypasses React's diffing engine (Virtual DOM) for ultra-fast, 60fps text updates without triggering full component re-renders.
6. **Triggering**: The animation naturally fires on mount, and is re-triggered gracefully on hover (`onPointerEnter`).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
