import { Reveal } from './Reveal';

const faqs = [
  {
    q: 'What is start.ng?',
    a: 'A home for free browser games made by the HNG community. Each game has its own address, like yourgame.start.ng, and you play it right in your browser.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. Every game on start.ng is free to play in your browser, with nothing to download.',
  },
  {
    q: 'Are there Nigerian or African web games?',
    a: 'Yes. Many games here are Naija-themed, from danfo rush hour to jollof and Lagos markets, and we welcome games from across Africa.',
  },
  {
    q: 'Do I need an account to play?',
    a: 'No. Sign in to get your start.ng character, keep your scores on the leaderboards and join the daily tournament.',
  },
  {
    q: 'What is the daily tournament?',
    a: 'Every day a few start.ng games are picked for 24 hours, and the best player wins. Points count towards the overall leaderboard.',
  },
  {
    q: 'How do I put my game on start.ng?',
    a: 'Push your browser game to a public GitHub repo, publish it with one API call and approve it once. It goes live at yourgame.start.ng. The docs have every step.',
  },
];

export function AboutFaq() {
  return (
    <section className="container section" id="about" aria-labelledby="about-title">
      <div className="about-grid">
        <Reveal>
          <p className="eyebrow">About start.ng</p>
          <h2 id="about-title">Nigeria&apos;s home for browser games</h2>
          <p className="about-copy" style={{ marginTop: 14 }}>
            start.ng is Nigeria&apos;s home for browser games, built by the HNG community. Every
            game is free to play in your browser with no download, and many are made in Naija: danfo
            rush hour, jollof catching, Lagos markets and more.
          </p>
          <p className="about-copy">
            We&apos;re also building a home for web games from across Africa. If you make games
            anywhere on the continent, you can put yours on start.ng for free.
          </p>
          <p style={{ marginBottom: 24 }}>
            <a className="link-arrow" href="https://start.ng/about" target="_blank" rel="noreferrer">
              More about start.ng →
            </a>
          </p>

          <h3 style={{ fontSize: '1.4rem', marginBottom: 4 }}>Questions</h3>
          <div className="faq">
            {faqs.map((faq, index) => (
              <details key={faq.q} open={index === 0}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100} className="about-side">
          <div className="stat-sticker">
            <b>188</b>
            <em>games and counting</em>
            <p>Every one free, every one playable on the phone in your pocket.</p>
          </div>
          <div className="stat-sticker">
            <b>24h</b>
            <em>daily tournament</em>
            <p>New picks every midnight. One winner, every day, all year.</p>
          </div>
          <div className="stat-sticker">
            <b>₦0</b>
            <em>to put yours up</em>
            <p>Public repo, one API call, one approval. That is the whole toll gate.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
