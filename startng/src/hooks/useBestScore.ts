import { useCallback, useSyncExternalStore } from 'react';

const KEY = 'startng.danfo.best';
const EVENT = 'startng:best-score';

function read(): number {
  try {
    const raw = window.localStorage.getItem(KEY);
    const value = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

/** Store a new personal best and let every listener (hero + game) know. */
export function writeBestScore(score: number) {
  try {
    window.localStorage.setItem(KEY, String(score));
  } catch {
    /* private mode, no problem — the session just will not remember */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** The visitor's Danfo Dash best, shared by the hero board and the game. */
export function useBestScore(): number {
  return useSyncExternalStore(
    useCallback(subscribe, []),
    read,
    () => 0,
  );
}

/** A tiny persisted boolean, used for the honk mute switch. */
export function usePersistedFlag(key: string, initial = false) {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key) === '1';
    } catch {
      return initial;
    }
  }, [key, initial]);

  const value = useSyncExternalStore(
    useCallback(
      (onChange: () => void) => {
        window.addEventListener('storage', onChange);
        window.addEventListener(`${key}:change`, onChange);
        return () => {
          window.removeEventListener('storage', onChange);
          window.removeEventListener(`${key}:change`, onChange);
        };
      },
      [key],
    ),
    getSnapshot,
    () => initial,
  );

  const set = useCallback(
    (next: boolean) => {
      try {
        window.localStorage.setItem(key, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      window.dispatchEvent(new Event(`${key}:change`));
    },
    [key],
  );

  return [value, set] as const;
}

