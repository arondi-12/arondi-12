import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/hero.css';
import './styles/game.css';
import './styles/shelf.css';
import './styles/sections.css';

/**
 * Open Graph wants absolute image URLs. The markup ships with `/og.png` so it
 * works on any host, and we resolve it against wherever this is deployed.
 */
for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
  const tag = document.querySelector<HTMLMetaElement>(selector);
  if (tag?.content) {
    tag.content = new URL(tag.content, window.location.origin).toString();
  }
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

