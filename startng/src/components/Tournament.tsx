import { useCountdown } from '../hooks/useCountdown';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import { leaderboard } from '../data/games';
import { Reveal } from './Reveal';

function Digits({ value }: { value: string }) {
  return (
    <>
      {value.split('').map((char, index) => (
        <span className="clock-digit" key={`${index}-${char}`}>
          {char}
        </span>
      ))}
    </>
  );
}

function DailyDrop() {
  const { hours, minutes, seconds, dayProgress } = useCountdown();

  return (
    <article className="feature feature--daily">
      <div className="feature-top">
        <span className="badge badge--halloween">🎃 Halloween drop</span>
        <span className="feature-index">01</span>
      </div>

      <p className="kicker">Daily tournament</p>

      <h3 className="feature-reel">
        <span className="sr-only">24 hours. One winner.</span>
        <span className="feature-reel-window" aria-hidden="true">
          <span className="feature-reel-line">24 hours</span>
          <span className="feature-reel-line">1 winner</span>
        </span>
      </h3>

      <p className="feature-copy">
        A few games get picked every day and hold the spotlight for exactly 24 hours. Highest score
        when the clock hits zero takes the points.
      </p>

      <div className="clock" aria-hidden="true">
        <Digits value={hours} />
        <span className="clock-colon">:</span>
        <Digits value={minutes} />
        <span className="clock-colon">:</span>
        <Digits value={seconds} />
        <span className="clock-unit">left</span>
      </div>
      <p className="sr-only">Time left in today&apos;s tournament: {hours} hours, {minutes} minutes.</p>

      <div className="day-rail" aria-hidden="true">
        <span style={{ width: `${Math.round(dayProgress * 100)}%` }} />
      </div>

      <ol className="daily-steps">
        <li>
          <span>01</span> Play any of today&apos;s three picks
        </li>
        <li>
          <span>02</span> Post your best score before midnight
        </li>
        <li>
          <span>03</span> Top score when the clock hits zero takes the points
        </li>
      </ol>

      <div className="feature-foot">
        <span className="feature-note">Resets every midnight, free to enter</span>
        <a className="link-arrow" href="#games">
          Today&apos;s picks →
        </a>
      </div>
    </article>
  );
}

function RooftopReach() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const score = useCountUp(59, inView, 1500);

  return (
    <article className="feature feature--reach">
      <div className="feature-top">
        <span className="badge">Leaderboard</span>
        <span className="feature-index">02</span>
      </div>

      <p className="kicker">Rooftop Rush · by Oluwafemi</p>

      <h3 className="feature-reach">
        Reach <span className="feature-score">{score}</span>
        <span className="feature-score-unit">pts</span>
      </h3>

      <div className="roof-ticks" ref={ref} aria-hidden="true">
        {Array.from({ length: 60 }, (_, index) => (
          <span
            key={index}
            className={`roof-tick${index < 59 ? ' is-lit' : ''}${inView ? ' is-on' : ''}`}
            style={{ transitionDelay: `${index * 16}ms` }}
          />
        ))}
      </div>

      <p className="feature-copy">
        One point per rooftop. 59 is where the city starts respecting your name — and you are three
        points off the top spot.
      </p>

      <ol className="board">
        {leaderboard.map((row) => (
          <li key={row.rank} className={row.you ? 'is-you' : undefined}>
            <span className="board-rank">{row.rank}</span>
            <span className="board-name">@{row.player}</span>
            <span className="board-points">{row.points}</span>
          </li>
        ))}
      </ol>

      <div className="feature-foot">
        <span className="feature-note">Resets tonight at 00:00</span>
        <a className="link-arrow" href="#games">
          Beat 59 →
        </a>
      </div>
    </article>
  );
}

export function Tournament() {
  return (
    <section className="container section section--split" id="tournament">
      <Reveal className="section-head">
        <div>
          <p className="eyebrow">This weekend</p>
          <h2>Two ways to get on the board</h2>
        </div>
        <p className="section-note">
          The weekend is a little haunted: ghost games are in the daily drop until Sunday midnight.
        </p>
      </Reveal>

      <div className="feature-grid">
        <Reveal delay={60}>
          <DailyDrop />
        </Reveal>
        <Reveal delay={140}>
          <RooftopReach />
        </Reveal>
      </div>
    </section>
  );
}
