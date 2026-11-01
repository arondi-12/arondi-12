import { marqueeGames } from '../data/games';

/** A lime ribbon of game names running under the hero. */
export function Marquee() {
  const row = [...marqueeGames, ...marqueeGames];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((name, index) => (
          <span className="marquee-item" key={`${name}-${index}`}>
            {name}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
