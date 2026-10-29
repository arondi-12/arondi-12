export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div className="site-footer-brand">
          <a className="logo" href="#top">
            start<span>.ng</span>
          </a>
          <p>Nigeria&apos;s home for browser games, made by the community and by creators across Africa.</p>
          <span className="footer-pumpkin" aria-hidden="true">
            🎃
          </span>
        </div>

        <nav aria-label="Play">
          <h2>Play</h2>
          <ul>
            <li>
              <a href="https://start.ng/games" target="_blank" rel="noreferrer">
                All games
              </a>
            </li>
            <li>
              <a href="#tournament">Daily tournament</a>
            </li>
            <li>
              <a href="https://start.ng/leaderboard" target="_blank" rel="noreferrer">
                Leaderboard
              </a>
            </li>
            <li>
              <a href="https://start.ng/hangout" target="_blank" rel="noreferrer">
                The Hangout
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Make games">
          <h2>Make games</h2>
          <ul>
            <li>
              <a href="https://start.ng/creators" target="_blank" rel="noreferrer">
                Independent creators
              </a>
            </li>
            <li>
              <a href="https://start.ng/docs" target="_blank" rel="noreferrer">
                Build a game
              </a>
            </li>
            <li>
              <a href="https://start.ng/docs.md" target="_blank" rel="noreferrer">
                Docs for your AI (.md)
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="About">
          <h2>About</h2>
          <ul>
            <li>
              <a href="https://start.ng/about" target="_blank" rel="noreferrer">
                About start.ng
              </a>
            </li>
            <li>
              <a href="#roster">All 188 games</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container site-footer-base">
        <span>© 2026 start.ng</span>
        <span>Games from Nigeria and across Africa.</span>
      </div>
    </footer>
  );
}
