import { useMemo } from 'react';
import type { CSSProperties } from 'react';

const COLORS = ['#d8fd71', '#ff8a3d', '#a9d6ff', '#ffb0cd', '#6a4bd6', '#292a23'];

/**
 * A short burst of paper confetti. Rendered only when `burst` changes, and
 * invisible to assistive tech (the copy toast carries the message).
 */
export function Confetti({ burst }: { burst: number }) {
  const pieces = useMemo(() => {
    if (!burst) return [];
    return Array.from({ length: 36 }, (_, index) => {
      const rand = (min: number, max: number) => min + Math.random() * (max - min);
      return {
        id: `${burst}-${index}`,
        left: rand(2, 98),
        width: rand(6, 11),
        height: rand(8, 16),
        color: COLORS[index % COLORS.length],
        drift: rand(-140, 140),
        spin: rand(240, 900),
        duration: rand(1.9, 3.1),
        delay: rand(0, 0.35),
      };
    });
  }, [burst]);

  if (pieces.length === 0) return null;

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <i
          key={piece.id}
          style={
            {
              '--x': `${piece.left}%`,
              '--w': `${piece.width}px`,
              '--h': `${piece.height}px`,
              '--c': piece.color,
              '--dx': `${piece.drift}px`,
              '--rot': `${piece.spin}deg`,
              '--dur': `${piece.duration}s`,
              '--delay': `${piece.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
