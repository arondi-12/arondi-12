import { allGames } from '../data/roster';
import { useBestScore } from '../hooks/useBestScore';
import { useCountdown } from '../hooks/useCountdown';

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Three taped-on cards beside the headline. The clock really counts down,
 * the "best" really is the visitor's Danfo Dash record, and the shelf number
 * really is the roster length — no invented live stats.
 */
export function StickerBoard() {
  const { hours, minutes, seconds, dayProgress } = useCountdown();
  const best = useBestScore();

  return (
    <aside className="board" aria-label="Today on start.ng">
      <div className="board-card board-card--drop">
        <span className="tape tape--tl" aria-hidden="true" />
        <div className="board-top">
          <span className="board-badge">Daily drop</span>
          <span className="board-live">
            <i aria-hidden="true" />
            live
          </span>
        </div>
        <p className="board-kicker">Three games, one winner</p>
        <p className="board-clock">
          {hours}:{minutes}:{seconds} <em>left</em>
        </p>
        <div className="board-rail" aria-hidden="true">
          <span style={{ width: `${Math.max(2, Math.round(dayProgress * 100))}%` }} />
        </div>
        <p className="board-caption">Resets at midnight, every night.</p>
      </div>

      <div className="board-card board-card--best">
        <div className="board-top">
          <span className="board-badge board-badge--lime">Your shelf</span>
          <span className="board-live">danfo dash</span>
        </div>
        <div className="board-best">
          <div>
            <p className="board-kicker">Personal best</p>
            <p className={`board-best-number${best > 0 ? '' : ' is-empty'}`}>
              {best > 0 ? pad(best) : '—'}
              <small>{best > 0 ? 'dodged' : 'no runs yet'}</small>
            </p>
          </div>
          <a className="board-best-link" href="#play">
            {best > 0 ? 'Beat it' : 'Play'} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="board-card board-card--shelf">
        <p className="board-shelf-number">{allGames.length}</p>
        <p className="board-shelf-text">
          <b>games on the shelf</b>
          every one free, every one in your browser
        </p>
        <span className="board-faces" aria-hidden="true">
          <i>🚌</i>
          <i>🍲</i>
          <i>🎲</i>
        </span>
      </div>
    </aside>
  );
}
