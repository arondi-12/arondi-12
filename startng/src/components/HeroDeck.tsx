import { useCountdown } from '../hooks/useCountdown';
import { Clock } from './Clock';

/**
 * The stack of live cards beside the headline. Everything here is real state:
 * the tournament clock ticks, the board is the weekend board. Hover (or focus)
 * straightens a card, lifts it off the pile and plays its small flourish.
 */
export function HeroDeck() {
  const { hours, minutes, seconds, dayProgress } = useCountdown();

  return (
    <div className="hero-deck" aria-label="Live on start.ng right now">
      <article className="hcard hcard--drop" tabIndex={0}>
        <div className="hcard-top">
          <span className="hcard-badge">
            <span aria-hidden="true">🎃</span> Halloween drop
          </span>
          <span className="hcard-live">
            <i aria-hidden="true" />
            live
          </span>
        </div>

        <p className="hcard-kicker">Daily tournament</p>

        <h2 className="hcard-reel">
          <span className="sr-only">24 hours, one winner</span>
          <span className="hcard-reel-window" aria-hidden="true">
            <span className="hcard-reel-line">24 hours</span>
            <span className="hcard-reel-line">1 winner</span>
          </span>
        </h2>

        <div className="hcard-clock">
          <Clock hours={hours} minutes={minutes} seconds={seconds} />
          <span className="hcard-clock-unit">left</span>
        </div>

        <div className="hcard-rail" aria-hidden="true">
          <span style={{ width: `${Math.round(dayProgress * 100)}%` }} />
        </div>
      </article>

      <article className="hcard hcard--reach" tabIndex={0}>
        <div className="hcard-top">
          <span className="hcard-badge hcard-badge--plain">Leaderboard</span>
          <span className="hcard-meta">Rooftop Rush</span>
        </div>

        <p className="hcard-reach">
          Reach <b>59</b>
          <span className="hcard-reach-unit">pts</span>
        </p>

        <div className="hcard-bar" aria-hidden="true">
          <span className="hcard-bar-fill" />
          <i className="hcard-bar-dot" />
        </div>
        <p className="hcard-bar-label">3 points off the top of the board</p>

        <ol className="hcard-board">
          <li>
            <span className="hcard-rank">1</span>
            <span className="hcard-name">@sundaychild</span>
            <b>62</b>
          </li>
          <li className="is-you">
            <span className="hcard-rank">3</span>
            <span className="hcard-name">@you</span>
            <b>59</b>
          </li>
        </ol>

        <span className="hcard-cta" aria-hidden="true">
          Play Rooftop Rush <i>↗</i>
        </span>
      </article>

      <article className="hcard hcard--now" tabIndex={0}>
        <span className="hcard-avatars" aria-hidden="true">
          <i>🕹️</i>
          <i>🎲</i>
          <i>👾</i>
        </span>
        <span className="hcard-now-text">
          <b>318</b> playing now
        </span>
      </article>
    </div>
  );
}
