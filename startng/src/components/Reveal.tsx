import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

type Props = {
  children: ReactNode;
  className?: string;
  /** ms of extra delay, used for staggering grids */
  delay?: number;
  role?: string;
  /** 'lift' rises into place, 'blur' focuses in from a soft blur */
  variant?: 'lift' | 'blur';
};

/** Reveals a block the first time it enters the viewport. */
export function Reveal({ children, className = '', delay = 0, role, variant = 'lift' }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      role={role}
      className={`reveal reveal--${variant}${inView ? ' is-in' : ''} ${className}`.trim()}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

