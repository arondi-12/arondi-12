import { useEffect, useMemo, useRef, useState } from 'react';
import { allGames } from '../data/roster';
import { Reveal } from './Reveal';

/**
 * The A–Z list from the live site, plus two small things it cannot do:
 * type-to-filter, and a button that picks a game for the indecisive.
 */
export function RosterShelf() {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const timers = useRef<number[]>([]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return allGames;
    return allGames.filter(
      (game) =>
        game.name.toLowerCase().includes(needle) || game.by.toLowerCase().includes(needle),
    );
  }, [query]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const surprise = () => {
    const pick = allGames[Math.floor(Math.random() * allGames.length)];
    setQuery('');
    setPicked(pick.slug);

    const scrollId = window.setTimeout(() => {
      const node = listRef.current?.querySelector(`#game-${CSS.escape(pick.slug)}`);
      node?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 80);

    const clearId = window.setTimeout(() => setPicked(null), 2800);
    timers.current.push(scrollId, clearId);
  };

  return (
    <section className="container section" id="roster" aria-labelledby="roster-title">
      <Reveal className="section-head">
        <div>
          <p className="eyebrow">The whole shelf</p>
          <h2 id="roster-title">Every game on start.ng, A to Z</h2>
        </div>
        <span className="sticker sticker--sky">no download, ever</span>
      </Reveal>

      <Reveal delay={80}>
        <div className="roster-panel">
          <span className="tape tape--tr" aria-hidden="true" />

          <div className="roster-tools">
            <label className="roster-search">
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle cx="9" cy="9" r="6.4" fill="none" stroke="currentColor" strokeWidth="2" />
                <path
                  d="m14 14 4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="sr-only">Search the games by name or creator</span>
              <input
                type="search"
                value={query}
                placeholder="Search a game or a creator…"
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  type="button"
                  className="roster-clear"
                  aria-label="Clear the search"
                  onClick={() => setQuery('')}
                >
                  ×
                </button>
              )}
            </label>

            <button type="button" className="btn btn--small" onClick={surprise}>
              Surprise me 🎲
            </button>

            <span className="roster-count" aria-live="polite">
              {filtered.length} of {allGames.length}
            </span>
          </div>

          <ul className="roster-list" ref={listRef}>
            {filtered.map((game) => (
              <li
                key={game.slug}
                id={`game-${game.slug}`}
                className={`roster-item${picked === game.slug ? ' is-picked' : ''}`}
              >
                <a href={`https://start.ng/games/${game.slug}`} target="_blank" rel="noreferrer">
                  <b>{game.name}</b>
                  <span>by {game.by}</span>
                </a>
              </li>
            ))}

            {filtered.length === 0 && (
              <li className="roster-empty">
                <b>No game called “{query}” yet</b>
                <span>That is not a no — that is a gap with your name on it.</span>
                <span>
                  <a className="link-arrow" href="https://start.ng/docs" target="_blank" rel="noreferrer">
                    Put yours on the shelf →
                  </a>
                </span>
              </li>
            )}
          </ul>

          <div className="roster-foot">
            <span>
              Every entry above is a real game at start.ng/games/&lt;name&gt;.
            </span>
            <a className="link-arrow" href="https://start.ng/games" target="_blank" rel="noreferrer">
              The paged list on start.ng →
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
