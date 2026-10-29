import { tickerGames } from '../data/games';

export function Ticker() {
  const row = [...tickerGames, ...tickerGames];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {row.map((game, index) => (
          <span className="ticker-item" key={`${game}-${index}`}>
            {game}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

