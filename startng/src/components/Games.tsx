import { featuredGames } from '../data/games';
import { Reveal } from './Reveal';

export function Games() {
  return (
    <section className="container section" id="games">
      <Reveal className="section-head" variant="blur">
        <div>
          <p className="eyebrow">Games from the community</p>
          <h2>Five picks for the weekend</h2>
        </div>
        <a className="link-arrow" href="#roster">
          See all 188 games →
        </a>
      </Reveal>

      <div className="game-grid">
        {featuredGames.map((game, index) => (
          <Reveal
            key={game.slug}
            delay={index * 80}
            className={index === 0 ? 'game-cell game-cell--lead' : 'game-cell'}
          >
            <a
              className={`game game--${game.art}`}
              href={`https://start.ng/games/${game.slug}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`Play ${game.name} by ${game.by} on start.ng`}
            >
              <div className={`game-art game-art--${game.art}`}>
                <span className="game-emoji" aria-hidden="true">
                  {game.emoji}
                </span>
                <span className="game-play" aria-hidden="true">
                  ▶
                </span>
              </div>

              <div className="game-body">
                <div className="game-head">
                  <h3>{game.name}</h3>
                  <span className="game-tag">{game.tag}</span>
                </div>
                <p className="game-line">{game.line}</p>
                {index === 0 && (
                  <ul className="game-extra">
                    <li>
                      <b>59</b> rooftop record
                    </li>
                    <li>
                      <b>2,148</b> runs today
                    </li>
                    <li>
                      <b>#3</b> on the board
                    </li>
                  </ul>
                )}
                <span className="game-cta">
                  Play {game.name} <i aria-hidden="true">↗</i>
                </span>
                <div className="game-foot">
                  <span className="game-by">by {game.by}</span>
                  <span className="game-stat">
                    <b>{game.statValue}</b> {game.statLabel}
                  </span>
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
