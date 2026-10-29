import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

type Props = {
  children: ReactNode;
  className?: string;
  /** ms of extra delay, used for staggering grids */
  delay?: number;
  role?: string;
};

/** Fades + lifts a block into place the first time it enters the viewport. */
export function Reveal({ children, className = '', delay = 0, role }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      role={role}
      className={`reveal${inView ? ' is-in' : ''} ${className}`.trim()}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
