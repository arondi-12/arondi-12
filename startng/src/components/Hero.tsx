import type { CSSProperties } from 'react';
import { MarkerBlob, ArrowDoodle, StarDoodle, Squiggle } from './Doodles';
import { StickerBoard } from './StickerBoard';

/** Splits a line into letters so each one can pop in on its own beat. */
function SplitLine({ text, startIndex }: { text: string; startIndex: number }) {
  return (
    <>
      {text.split('').map((char, index) =>
        char === ' ' ? (
          <span className="space" key={`space-${index}`} />
        ) : (
          <span
            className="ch"
            key={`${char}-${index}`}
            style={{ '--i': startIndex + index } as CSSProperties}
          >
            {char}
          </span>
        ),
      )}
    </>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span aria-hidden="true">🎈</span> Big imagination. Played everywhere.
          </p>

          <h1 className="hero-title" id="hero-title">
            <span className="sr-only">Good vibes. Good games.</span>
            <span className="line" aria-hidden="true">
              <SplitLine text="Good vibes." startIndex={0} />
            </span>
            <span className="line line--two" aria-hidden="true">
              <span className="marker">
                <MarkerBlob />
              </span>
              <SplitLine text="Good games." startIndex={11} />
            </span>
          </h1>

          <p className="hero-lead">
            Games made by builders in the community. Each one lives at its own start.ng address.
            Pick one and play right in your browser — no download, no waiting.
          </p>

          <div className="hero-actions">
            <a className="btn" href="#play">
              Play now <span aria-hidden="true">▶</span>
            </a>
            <a className="btn btn--ghost" href="#shelf">
              See all 188 games →
            </a>
          </div>

          <p className="hero-note hand">
            one of them is playable right here
            <ArrowDoodle className="hero-note-arrow" />
          </p>

          <ul className="hero-proof">
            <li>188 games</li>
            <li>free, no download</li>
            <li>made in Naija</li>
          </ul>
        </div>

        <StickerBoard />

        <StarDoodle className="hero-doodle hero-doodle--star" />
        <Squiggle className="hero-doodle hero-doodle--squiggle" />
      </div>
    </section>
  );
}
