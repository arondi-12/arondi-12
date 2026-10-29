import { Reveal } from './Reveal';

const steps = [
  {
    title: 'Build it',
    body: 'Any static browser game: HTML, JavaScript, three.js, Phaser. Players bring their start.ng character, scores and friends.',
  },
  {
    title: 'Push it to GitHub',
    body: 'A public repo with a ready-to-play index.html at the top or in dist/, plus a cover.png for its card.',
  },
  {
    title: 'Publish it',
    body: 'One API call with your repo link, no key needed. Or hand your AI start.ng/docs and let it do the lot.',
  },
  {
    title: 'Approve it once',
    body: "Open the link you get back and it's live at yourgame.start.ng, with its own leaderboard if you want one. After that, every push updates it.",
  },
];

export function Build() {
  return (
    <section className="container section build" id="build">
      <Reveal className="section-head">
        <div>
          <p className="eyebrow">Got a game?</p>
          <h2>Put it on start.ng</h2>
        </div>
        <p className="section-note">
          Free for anyone building in Nigeria or anywhere across Africa.
        </p>
      </Reveal>

      <div className="build-grid">
        <div className="steps" role="list">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 70} className="step" role="listitem">
              <span className="step-num">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <b>{step.title}</b>
                <span>{step.body}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="code-card-wrap">
          <div className="code-card">
            <div className="code-card-top">
              <span />
              <span />
              <span />
              <em>publish.sh</em>
            </div>
            <pre>
              <code>
                <span className="code-comment"># one call, no key needed</span>
                {'\n'}
                <span className="code-key">curl</span> -X POST \
                {'\n  '}https://api.start.ng/games \
                {'\n  '}-d <span className="code-str">{'\'{"repo":"github.com/you/game"}\''}</span>
                {'\n\n'}
                <span className="code-ok">✓ live at yourgame.start.ng</span>
                <span className="code-caret" aria-hidden="true" />
              </code>
            </pre>
          </div>
        </Reveal>
      </div>

      <Reveal className="build-actions" delay={80}>
        <a className="btn" href="https://start.ng/docs" target="_blank" rel="noreferrer">
          Read the docs
        </a>
        <a className="btn btn--ghost" href="https://start.ng/docs.md" target="_blank" rel="noreferrer">
          Docs for your AI (.md)
        </a>
      </Reveal>
    </section>
  );
}
