import { useEffect, useState } from 'react';

const links = [
  { href: '#shelf', label: 'Games' },
  { href: '#tournament', label: 'Tournament' },
  { href: '#build', label: 'Creators' },
  { href: 'https://start.ng/docs', label: 'Docs', external: true },
];

export function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav${stuck ? ' is-stuck' : ''}${open ? ' is-open' : ''}`}>
      <div className="container nav-inner">
        <a className="logo" href="#top" aria-label="start.ng home">
          start<span className="dot-ng">.ng</span>
        </a>

        <nav className="nav-links" aria-label="Pages">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="btn btn--small" href="#play">
            Play now
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="nav-drawer" id="nav-drawer">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noreferrer' : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
