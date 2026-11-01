/**
 * Hand-drawn bits: the marker behind the headline, the doodles that float
 * around the page, and the little arrow that points at the playable bit.
 * All decorative, all aria-hidden.
 */

type Props = { className?: string };

/** The lime highlighter behind "Good games." — a blob, not a rectangle. */
export function MarkerBlob({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 42"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 27C38 13 78 33 118 21c40-12 74 6 114-4 22-6 44 2 64 4v14c-24 4-44-2-68 2-38 6-72-8-112 2-32 8-70-4-113 4Z"
        fill="var(--lime)"
      />
      <path
        d="M6 33c44-8 82 4 118-2 42-7 76-1 112-6 22-3 40 1 58 3"
        fill="none"
        stroke="rgba(41,42,35,0.16)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StarDoodle({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path
        d="M20 2c1.8 8.2 4.4 12.6 6 14.2 1.6 1.6 5.6 2.2 12 3.8-6.4 1.6-10.4 2.2-12 3.8-1.6 1.6-4.2 6-6 14.2-1.8-8.2-4.4-12.6-6-14.2-1.6-1.6-5.6-2.2-12-3.8 6.4-1.6 10.4-2.2 12-3.8 1.6-1.6 4.2-6 6-14.2Z"
        fill="var(--lime)"
        stroke="var(--ink)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 70 34" aria-hidden="true" focusable="false">
      <path
        d="M3 24c6-14 12-14 18 0s12 14 18 0 12-14 18 0 6 8 10 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowDoodle({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 60 40" aria-hidden="true" focusable="false">
      <path
        d="M2 6c14 16 26 22 44 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M34 24.5c5 2.4 8.4 4 12 5.5-4.6 1-8.4 2.6-13 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 1.5c1 4.6 2.4 7 3.4 8 1 1 3.4 2.4 7.1 3-3.7.7-6.1 2-7.1 3s-2.4 3.4-3.4 8c-1-4.6-2.4-7-3.4-8-1-1-3.4-2.3-7.1-3 3.7-.6 6.1-2 7.1-3s2.4-3.4 3.4-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FooterScribble({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 130 26" aria-hidden="true" focusable="false">
      <path
        d="M2 18c10-10 18 4 28-4s18 4 28-4 18 4 28-4 18 4 28-4"
        fill="none"
        stroke="var(--lime-deep)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
