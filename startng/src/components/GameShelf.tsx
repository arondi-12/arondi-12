import { featuredGames } from '../data/games';
import { Reveal } from './Reveal';

/** "Games from the community" — the same five-card shelf idea as the live site. */
export function GameShelf() {
  return (
    <section className="container section" id="shelf" aria-labelledby="shelf-title">
      <Reveal className="section-head">
        <div>
          <p className="eyebrow">Games from the community</p>
          <h2 id="shelf-title">Fresh off the shelf</h2>
        </div>
        <p className="section-note">
          Five picks from the 188. Every one opens in its own tab at its own start.ng address.
        </p>
      </Reveal>

      <div className="shelf">
        {featuredGames.map((game, index) => (
          <Reveal key={game.slug} delay={index * 70} variant="tilt" className="game-cell">
            <article className="game-card">
              <div className={`game-cover game-cover--${game.art}`}>
                <span className="emoji" aria-hidden="true">
                  {game.emoji}
                </span>
                <span className="game-play-badge" aria-hidden="true">
                  ▶ Play
                </span>
              </div>

              <div className="game-body">
                <h3>
                  <a
                    href={game.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Play ${game.name} by ${game.by} on start.ng`}
                  >
                    {game.name}
                  </a>
                </h3>
                <span className="game-tag">{game.tag}</span>
                <p className="game-line">{game.line}</p>
                <span className="game-by">
                  by <b>{game.by}</b>
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="shelf-foot">
        <a className="btn btn--ghost" href="https://start.ng/games" target="_blank" rel="noreferrer">
          See all 188 games →
        </a>
        <span className="hand">psst — the whole list is just below ↓</span>
      </div>
    </section>
  );
}
