import { useCountdown } from '../hooks/useCountdown';

/** The slim ink strip at the very top. Not a cookie bar — a countdown. */
export function TapeStrip() {
  const { hours, minutes, seconds } = useCountdown();

  return (
    <div className="tape-strip">
      <div className="tape-strip-inner">
        <span className="tape-hide-sm" aria-hidden="true">
          ✦
        </span>
        <span>
          <b>Daily drop</b> <span className="tape-hide-sm">· three games, 24 hours, one winner</span>
        </span>
        <span className="clock-inline">
          {hours}:{minutes}:{seconds}
        </span>
        <a href="#play">Play now →</a>
      </div>
    </div>
  );
}
