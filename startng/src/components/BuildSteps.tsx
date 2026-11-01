import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

const steps: { title: string; body: ReactNode }[] = [
  {
    title: 'Build it',
    body: (
      <>
        Any static browser game: HTML, JavaScript, three.js, Phaser. Players bring their start.ng
        character, scores and friends.
      </>
    ),
  },
  {
    title: 'Push it to GitHub',
    body: (
      <>
        A public repo with a ready-to-play <code>index.html</code> at the top or in{' '}
        <code>dist/</code>, plus a <code>cover.png</code> for its card.
      </>
    ),
  },
  {
    title: 'Publish it',
    body: (
      <>
        One API call with your repo link, no key needed. Or hand your AI{' '}
        <code>start.ng/docs</code> and let it do the lot.
      </>
    ),
  },
  {
    title: 'Approve it once',
    body: (
      <>
        Open the link you get back and it&apos;s live at <code>yourgame.start.ng</code>, with its
        own leaderboard if you want one. After that, every push updates it.
      </>
    ),
  },
];

export function BuildSteps() {
  return (
    <section className="container section" id="build" aria-labelledby="build-title">
      <Reveal className="section-head">
        <div>
          <p className="eyebrow">Got a game?</p>
          <h2 id="build-title">Put it on start.ng</h2>
        </div>
        <p className="section-note">
          Free for anyone building in Nigeria, or anywhere across Africa. Your game, your address,
          your leaderboard.
        </p>
      </Reveal>

      <div className="build-grid">
        <Reveal className="steps" delay={40}>
          {steps.map((step, index) => (
            <div className="step" key={step.title}>
              <span className="step-num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <b>{step.title}</b>
                <span>{step.body}</span>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={120} className="build-side">
          <div className="code-card">
            <div className="code-card-top" aria-hidden="true">
              <i />
              <i />
              <i />
              <em>publish.sh</em>
            </div>
            <pre>
              <code>
                <span className="code-comment"># one call, no key needed</span>
                {'\n'}
                <span className="code-key">curl</span> -X POST \ {'\n  '}
                https://api.start.ng/games \ {'\n  '}-d{' '}
                <span className="code-str">{'\'{"repo":"github.com/you/game"}\''}</span>
                {'\n\n'}
                <span className="code-ok">✓ live at yourgame.start.ng</span>
                <span className="code-caret" aria-hidden="true" />
              </code>
            </pre>
          </div>

          <p className="build-note">
            <span aria-hidden="true">🛠️</span>
            Your game keeps its own repo. Pushing to it updates the game — nobody has to redeploy
            the shelf.
          </p>

          <div className="build-actions">
            <a className="btn" href="https://start.ng/docs" target="_blank" rel="noreferrer">
              Read the docs
            </a>
            <a
              className="btn btn--ghost"
              href="https://start.ng/docs.md"
              target="_blank"
              rel="noreferrer"
            >
              Docs for your AI (.md)
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
