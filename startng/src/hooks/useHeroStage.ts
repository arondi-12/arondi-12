import { useEffect, useRef } from 'react';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Drives the pinned hero. Instead of re-rendering React on every scroll frame we
 * write a handful of normalised values onto the sticky stage as CSS variables and
 * let CSS do the animation work:
 *
 *   --p    0 → 1   how far through the hero scroll track we are
 *   --reel 0 → 1   "vibes" rolls out, "games" rolls in
 *   --mark 0 → 1   the lime highlighter sweeping under the second word
 *   --more 0 → 1   the secondary line and link easing in
 */
export function useHeroStage(enabled: boolean) {
  const trackRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    if (!enabled) {
      stage.style.setProperty('--p', '1');
      stage.style.setProperty('--reel', '1');
      stage.style.setProperty('--mark', '1');
      stage.style.setProperty('--more', '1');
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp01(-rect.top / total) : 1;

      const reel = smooth(clamp01((p - 0.08) / 0.2));
      const mark = smooth(clamp01((p - 0.26) / 0.16));
      const more = smooth(clamp01((p - 0.42) / 0.22));

      stage.style.setProperty('--p', p.toFixed(4));
      stage.style.setProperty('--reel', reel.toFixed(4));
      stage.style.setProperty('--mark', mark.toFixed(4));
      stage.style.setProperty('--more', more.toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return { trackRef, stageRef };
}
