import { useEffect, useState } from 'react';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 up to `target` once `active` flips true.
 * Jumps straight to the target when motion is reduced.
 */
export function useCountUp(target: number, active: boolean, duration = 1400, instant = false): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (instant) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration, instant]);

  return value;
}
