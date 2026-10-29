import { useEffect, useState } from 'react';

const DAY_MS = 24 * 60 * 60 * 1000;

const pad = (value: number) => String(value).padStart(2, '0');

export type Countdown = {
  hours: string;
  minutes: string;
  seconds: string;
  /** 0 → 1 through the tournament day, used for the thin progress rail. */
  dayProgress: number;
  hoursLeft: number;
};

/** Live clock for the daily tournament: it resets at midnight, local time. */
export function useCountdown(): Countdown {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const remaining = Math.max(0, midnight.getTime() - now);
  const hoursLeft = remaining / (60 * 60 * 1000);

  return {
    hours: pad(Math.floor(remaining / (60 * 60 * 1000))),
    minutes: pad(Math.floor(remaining / (60 * 1000)) % 60),
    seconds: pad(Math.floor(remaining / 1000) % 60),
    dayProgress: Math.min(1, Math.max(0, 1 - remaining / DAY_MS)),
    hoursLeft,
  };
}
