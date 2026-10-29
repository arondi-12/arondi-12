import { useEffect, useState } from 'react';
import { useHeroStage } from '../hooks/useHeroStage';

type Props = {
  reduced: boolean;
};

export function Hero({ reduced }: Props) {
  const { trackRef, stageRef } = useHeroStage(!reduced);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      className={`hero${reduced ? ' hero--reduced' : ''}${entered ? ' is-entered' : ''}`}
      ref={trackRef}
      aria-label="start.ng"
    >
      <div className="hero-stage" ref={stageRef}>
        <div className="hero-inner">
          <p className="hero-eyebrow">Big imagination. Played everywhere.</p>

          {reduced ? (
            <h1 className="hero-title hero-title--static">
              Good vibes.
              <br />
              <mark>Good games.</mark>
            </h1>
          ) : (
            <h1 className="hero-title">
              <span className="sr-only">Good vibes. Good games.</span>
              <span className="hero-row" aria-hidden="true">
                <span className="hero-good">Good</span>
                <span className="hero-swap">
                  <span className="hero-reel">
                    <span className="hero-word hero-word--out">vibes.</span>
                    <span className="hero-word hero-word--in">games.</span>
                  </span>
                  <span className="hero-mark" />
                </span>
              </span>
            </h1>
          )}

          <div className="hero-leads">
            <p className="hero-lead hero-lead--one">
              Games made by builders in the community. Each one lives at its own start.ng address.
              Pick one and play right in your browser.
            </p>
            <p className="hero-lead hero-lead--two">
              188 free games, made in Nigeria and across Africa. New picks every 24 hours, a
              leaderboard with your name on it, and nothing to download.
            </p>
          </div>

          <div className="hero-actions">
            <a className="btn" href="#games">
              Play now
            </a>
            <a className="btn btn--ghost hero-more" href="#roster">
              See all 188 games →
            </a>
          </div>
        </div>

        {!reduced && (
          <>
            <div className="hero-rail" aria-hidden="true">
              <span />
            </div>
            <p className="hero-hint" aria-hidden="true">
              <span>scroll</span>
              <i />
            </p>
          </>
        )}
      </div>
    </section>
  );
}
