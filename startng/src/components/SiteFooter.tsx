import { FooterScribble } from './Doodles';

const columns = [
  {
    heading: 'Play',
    links: [
      { label: 'All games', href: 'https://start.ng/games' },
      { label: 'Daily tournament', href: '#tournament' },
      { label: 'Leaderboard', href: 'https://start.ng/leaderboard' },
      { label: 'Categories', href: 'https://start.ng/categories' },
      { label: 'The Hangout', href: 'https://start.ng/hangout' },
    ],
  },
  {
    heading: 'Make games',
    links: [
      { label: 'Independent creators', href: 'https://start.ng/creators' },
      { label: 'Build a game', href: 'https://start.ng/docs' },
      { label: 'Docs for your AI (.md)', href: 'https://start.ng/docs.md' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'About start.ng', href: 'https://start.ng/about' },
      { label: 'The whole shelf', href: '#roster' },
      { label: 'Danfo Dash', href: '#play' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div className="site-footer-brand">
          <a className="logo" href="#top" aria-label="Back to the top">
            start<span className="dot-ng">.ng</span>
          </a>
          <p>Nigeria&apos;s home for browser games, made by the community and by creators across Africa.</p>
          <FooterScribble className="footer-doodle" />
        </div>

        {columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2>{column.heading}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container site-footer-base">
        <span>© 2026 start.ng</span>
        <span className="footer-flag">🇳🇬 Games from Nigeria and across Africa.</span>
        <span>A playful design concept, made for the HNG community.</span>
      </div>
    </footer>
  );
}
