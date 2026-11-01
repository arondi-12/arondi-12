import { useCountdown } from '../hooks/useCountdown';
import { Reveal } from './Reveal';

const steps = [
  { title: 'Play a pick', body: 'Three games hold the spotlight for the day. Any of them counts.' },
  { title: 'Post a score', body: 'Your best run is the one that sticks. No download, no install.' },
  {
    title: 'Take the points',
    body: 'The highest score at midnight goes on the board, and the next three games drop.',
  },
];

function Digits({ value }: { value: string }) {
  return (
    <>
      {value.split('').map((digit, index) => (
        <span className="t-clock-digit" key={`${index}-${digit}`}>
          {digit}
        </span>
      ))}
    </>
  );
}

/** The 24-hour tournament, told with a live clock instead of a poster. */
export function Tournament() {
  const { hours, minutes, seconds, dayProgress } = useCountdown();

  return (
    <section className="container section" id="tournament" aria-labelledby="tournament-title">
      <Reveal variant="tilt">
        <div className="tournament-card">
          <div>
            <p className="eyebrow">The daily tournament</p>
            <h2 id="tournament-title">
              One game. 24 hours. <em>One winner.</em>
            </h2>
            <p className="tournament-lede">
              Every midnight, three community games take the spotlight for a day. Play, post your
              best, and the name at the top of the board at midnight gets the points.
            </p>

            <ol className="tournament-steps">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span className="tnum">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <b>{step.title}</b>
                    <em>{step.body}</em>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="tournament-clock-card">
            <p className="tournament-clock-label">Resets in</p>
            <p className="t-clock">
              <span>
                <Digits value={hours} />
              </span>
              <i aria-hidden="true">:</i>
              <span>
                <Digits value={minutes} />
              </span>
              <i aria-hidden="true">:</i>
              <span>
                <Digits value={seconds} />
              </span>
            </p>
            <div className="tournament-rail" aria-hidden="true">
              <span style={{ width: `${Math.max(2, Math.round(dayProgress * 100))}%` }} />
            </div>
            <p className="tournament-clock-note">
              The clock is your device&apos;s — it really is counting down.
            </p>
            <a className="btn" href="#play">
              Warm up on Danfo Dash
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
