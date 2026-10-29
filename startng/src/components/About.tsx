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

export function About() {
  return (
    <section className="container section about" id="about">
      <Reveal>
        <p className="eyebrow">About</p>
        <h2>Nigeria&apos;s home for browser games</h2>
        <p className="about-copy">
          start.ng is Nigeria&apos;s home for browser games, built by the HNG community. Every game is
          free to play in your browser with no download, and many are made in Naija: danfo rush hour,
          jollof catching, Lagos markets and more.
        </p>
        <p className="about-copy">
          We&apos;re also building a home for web games from across Africa. If you make games anywhere
          on the continent, you can put yours on start.ng for free.
        </p>
      </Reveal>

      <div className="about-grid">
        <Reveal delay={60}>
          <h3 className="about-sub">Questions</h3>
          <div className="faq">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="about-side">
          <div className="stat-card">
            <span className="stat-big">188</span>
            <span className="stat-label">games and counting</span>
            <p>Every one free, every one playable on the phone in your pocket.</p>
          </div>
          <div className="stat-card stat-card--dark">
            <span className="stat-big">24h</span>
            <span className="stat-label">daily tournament</span>
            <p>New picks every midnight. One winner, every day, all year.</p>
          </div>
          <a className="link-arrow" href="https://start.ng/about" target="_blank" rel="noreferrer">
            More about start.ng →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
