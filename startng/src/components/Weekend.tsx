import { useCountdown } from '../hooks/useCountdown';
import { Clock } from './Clock';
import { Reveal } from './Reveal';

const steps = [
  {
    title: 'Play a pick',
    body: 'Three games hold the spotlight for the day. Any of them counts.',
  },
  {
    title: 'Post a score',
    body: 'Your best run is the one that sticks. No account, no download.',
  },
  {
    title: 'Take the points',
    body: 'Highest score when the clock hits zero goes on the board.',
  },
];

/** A thin band that explains the daily tournament without repeating the hero cards. */
export function Weekend() {
  const { hours, minutes, seconds, dayProgress } = useCountdown();

  return (
    <section className="container weekend" id="tournament">
      <Reveal className="weekend-card" variant="blur">
        <div className="weekend-top">
          <div className="weekend-head">
            <p className="eyebrow">This weekend</p>
            <h2>One game. 24&nbsp;hours. One winner.</h2>
          </div>

          <div className="weekend-clock">
            <span className="weekend-label">Resets in</span>
            <Clock hours={hours} minutes={minutes} seconds={seconds} />
            <div className="weekend-rail" aria-hidden="true">
              <span style={{ width: `${Math.round(dayProgress * 100)}%` }} />
            </div>
            <a className="link-arrow" href="#games">
              Today&apos;s picks →
            </a>
          </div>
        </div>

        <ol className="weekend-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="weekend-num">{String(index + 1).padStart(2, '0')}</span>
              <b>{step.title}</b>
              <em>{step.body}</em>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
