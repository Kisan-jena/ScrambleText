import { ScrambleText } from '@/components/ScrambleText';

export default function Home() {
  return (
    <div className="flex min-h-svh justify-center bg-zinc-50 dark:bg-zinc-950 font-sans">
      <main className="flex flex-col w-full max-w-160 px-5 py-20 gap-6">
        <h1 className="text-3xl font-bold leading-tight cursor-default">
          <ScrambleText delay={0}>Anime.js Scramble Text</ScrambleText>
        </h1>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 cursor-default">
          <ScrambleText delay={200}>
            A lightweight text scramble effect built into anime.js v4. Hover
            over any element on this page to see the scramble animation in
            action.
          </ScrambleText>
        </p>

        <h2 className="text-xl font-bold leading-tight mt-4 cursor-default">
          <ScrambleText delay={400}>Features</ScrambleText>
        </h2>

        <ul className="flex flex-col gap-2 list-none pl-0">
          {[
            'Named character sets and range syntax for the chars parameter',
            'Directional reveal with the from parameter',
            'Adjustable interval between each character',
            'Per-character settle duration control',
            'Deterministic output with seeded random',
            'Cursor pattern for sweep-style effects',
            'Perturbation to randomize timing and order',
            'Fill character for different-length transitions',
            'Works with any easing function',
          ].map((feature, i) => (
            <li
              key={i}
              className="relative text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 pl-5 cursor-default before:content-['>'] before:absolute before:left-0 before:text-zinc-400 dark:before:text-zinc-500"
            >
              <ScrambleText delay={600 + i * 150}>{feature}</ScrambleText>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-bold leading-tight mt-4 cursor-default">
          <ScrambleText delay={2100}>How It Works</ScrambleText>
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 cursor-default">
          <ScrambleText delay={2300}>
            The scrambleText helper returns a function-based tween value. Each
            target element gets its own closure that captures the original text
            content and computes a per-character reveal timeline. Characters
            transition through random values before settling on their final
            position.
          </ScrambleText>
        </p>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 cursor-default">
          <ScrambleText delay={2600}>
            The animation duration is automatically calculated from the text
            length and timing parameters, ensuring consistent visual pacing
            regardless of content size, or use the duration parameter to set an
            exact duration that overrides the computed value.
          </ScrambleText>
        </p>
      </main>
    </div>
  );
}
