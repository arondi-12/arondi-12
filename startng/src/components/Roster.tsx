import { allGames } from '../data/roster';
import { Reveal } from './Reveal';

export function Roster() {
  return (
    <section className="container section section--roster" id="roster">
      <Reveal className="section-head" variant="blur">
        <div>
          <p className="eyebrow">The whole shelf</p>
          <h2>Every game on start.ng, A to Z</h2>
        </div>
        <span className="count-chip">{allGames.length} games</span>
      </Reveal>

      <Reveal delay={80}>
        <details className="roster">
          <summary>
            <span>Browse the full list &mdash; {allGames.length} games</span>
            <i aria-hidden="true" />
          </summary>
          <ul className="roster-list">
            {allGames.map((game) => (
              <li key={game.slug}>
                <a href={`https://start.ng/games/${game.slug}`} target="_blank" rel="noreferrer">
                  {game.name}
                </a>
                <span>by {game.by}</span>
              </li>
            ))}
          </ul>
        </details>
      </Reveal>
    </section>
  );
}
