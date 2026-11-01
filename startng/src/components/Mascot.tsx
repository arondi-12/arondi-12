import { useEffect, useRef, useState } from 'react';
import { usePersistedFlag } from '../hooks/useBestScore';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LINES = [
  'Abeg, try the Danfo Dash above.',
  'One lane at a time. Like Oshodi.',
  '188 games. I have counted them twice.',
  'Click me. I honk.',
  'Pothole? What pothole?',
];

/**
 * The mascot: a danfo with googly eyes that follow the pointer, a speech
 * bubble full of small talk, and a honk you can switch off for good.
 */
export function Mascot() {
  const reduced = useReducedMotion();
  const [muted, setMuted] = usePersistedFlag('startng.mascot.muted');
  const [line, setLine] = useState(0);
  const [honking, setHonking] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const node = svgRef.current;
      if (!node || reduced) return;
      const rect = node.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      node.style.setProperty('--eye-x', `${Math.max(-1, Math.min(1, dx * 2.2)).toFixed(2)}`);
      node.style.setProperty('--eye-y', `${Math.max(-1, Math.min(1, dy * 2.2)).toFixed(2)}`);
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setLine((value) => (value + 1) % LINES.length), 9000);
    timers.current.push(id);
    return () => {
      window.clearInterval(id);
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reduced]);

  const honk = () => {
    setLine((value) => (value + 1) % LINES.length);
    setHonking(true);
    timers.current.push(window.setTimeout(() => setHonking(false), 950));

    if (muted) return;
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = audioRef.current ?? new Ctor();
      audioRef.current = ctx;
      if (ctx.state === 'suspended') void ctx.resume();

      const now = ctx.currentTime;
      [0, 0.13].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(430, now + offset);
        osc.frequency.exponentialRampToValueAtTime(300, now + offset + 0.1);
        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.07, now + offset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.11);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.12);
      });
    } catch {
      /* no audio, no drama */
    }
  };

  return (
    <div className={`mascot${honking ? ' is-honking' : ''}`}>
      <p className="mascot-bubble" aria-live="off">
        {LINES[line]}
      </p>

      <button type="button" className="mascot-btn" onClick={honk} aria-label="Honk the danfo mascot">
        <svg
          ref={svgRef}
          viewBox="0 0 120 112"
          role="img"
          aria-label="A smiling yellow danfo bus"
        >
          <title>A smiling yellow danfo bus</title>
          <ellipse cx="60" cy="101" rx="42" ry="6" fill="rgba(41,42,35,0.14)" />

          <rect
            x="9"
            y="16"
            width="102"
            height="66"
            rx="15"
            fill="#ffd93d"
            stroke="#292a23"
            strokeWidth="4"
          />
          <rect x="20" y="25" width="34" height="26" rx="6" fill="#a9d6ff" stroke="#292a23" strokeWidth="3" />
          <rect x="62" y="25" width="30" height="26" rx="6" fill="#a9d6ff" stroke="#292a23" strokeWidth="3" />
          <rect x="9" y="54" width="102" height="5" fill="#ff8a3d" stroke="#292a23" strokeWidth="2" />

          {/* googly eyes */}
          <g style={{ transform: 'translate(calc(var(--eye-x, 0) * 4px), calc(var(--eye-y, 0) * 4px))' }}>
            <circle cx="44" cy="76" r="10" fill="#fffefa" stroke="#292a23" strokeWidth="3" />
            <circle cx="44" cy="76" r="4.5" fill="#292a23" />
            <circle cx="46" cy="74" r="1.6" fill="#fffefa" />
            <circle cx="76" cy="76" r="10" fill="#fffefa" stroke="#292a23" strokeWidth="3" />
            <circle cx="76" cy="76" r="4.5" fill="#292a23" />
            <circle cx="78" cy="74" r="1.6" fill="#fffefa" />
          </g>

          <path
            d="M52 88c4 4 12 4 16 0"
            fill="none"
            stroke="#292a23"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <circle cx="26" cy="94" r="11" fill="#292a23" />
          <circle cx="26" cy="94" r="4" fill="#f6f5ee" />
          <circle cx="94" cy="94" r="11" fill="#292a23" />
          <circle cx="94" cy="94" r="4" fill="#f6f5ee" />
        </svg>
      </button>

      <button
        type="button"
        className="mascot-mute"
        onClick={() => setMuted(!muted)}
        aria-pressed={muted}
      >
        {muted ? 'sound: off' : 'sound: on'}
      </button>
    </div>
  );
}
