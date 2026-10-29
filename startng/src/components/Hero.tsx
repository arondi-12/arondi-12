import { Fragment, type CSSProperties } from 'react';
import { HeroDeck } from './HeroDeck';

type Props = {
  reduced: boolean;
};

const lineOne = [
  { text: 'Good', index: 0 },
  { text: 'vibes.', index: 1 },
];

const lineTwo = [
  { text: 'Good', index: 2 },
  { text: 'games.', index: 3 },
];

const Word = ({ text, index }: { text: string; index: number }) => (
  <span className="hero-w" style={{ '--i': index } as CSSProperties}>
    {text}
  </span>
);

export function Hero({ reduced }: Props) {
  return (
    <section className={`hero${reduced ? ' hero--reduced' : ''}`} aria-label="start.ng">
      <div className="hero-glow" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow" style={{ '--i': 0 } as CSSProperties}>
            Big imagination. Played everywhere.
          </p>

          <h1 className="hero-title">
            <span className="hero-line">
              {lineOne.map((word, index) => (
                <Fragment key={word.text}>
                  {index > 0 && ' '}
                  <Word {...word} />
                </Fragment>
              ))}
            </span>
            <span className="hero-line">
              <span className="hero-mark-wrap">
                <span className="hero-underline" aria-hidden="true" />
                {lineTwo.map((word, index) => (
                  <Fragment key={word.text}>
                    {index > 0 && ' '}
                    <Word {...word} />
                  </Fragment>
                ))}
              </span>
            </span>
          </h1>

          <p className="hero-lead" style={{ '--i': 4 } as CSSProperties}>
            188 free browser games, made by the community. New picks every 24 hours, and a
            leaderboard with your name on it.
          </p>

          <div className="hero-actions" style={{ '--i': 5 } as CSSProperties}>
            <a className="btn" href="#games">
              Play now
            </a>
            <a className="btn btn--ghost" href="#roster">
              See all 188 games →
            </a>
          </div>

          <p className="hero-proof" style={{ '--i': 6 } as CSSProperties}>
            <span>188 games</span>
            <span>free, no download</span>
            <span>made in Naija</span>
          </p>
        </div>

        <HeroDeck />
      </div>
    </section>
  );
}
