import { useEffect, useRef, useState } from 'react';
import { Confetti } from './Confetti';
import { Reveal } from './Reveal';

const SITE = 'https://start.ng/';
const SHARE_TEXT = 'Good vibes, good games. 188 free browser games from Nigerian builders:';

export function ShareBand() {
  const [burst, setBurst] = useState(0);
  const [toast, setToast] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const celebrate = () => {
    setBurst((value) => value + 1);
    setToast(true);
    timers.current.push(window.setTimeout(() => setToast(false), 2200));
  };

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SITE);
      } else {
        const field = document.createElement('textarea');
        field.value = SITE;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        field.remove();
      }
    } catch {
      /* the toast below is honest either way — copy is best effort */
    }
    celebrate();
  };

  return (
    <section className="container section" aria-labelledby="share-title">
      <Reveal variant="tilt">
        <div className="share-band">
          <div>
            <p className="eyebrow">Pass the vibe</p>
            <h2 id="share-title">Send someone a good afternoon</h2>
            <p>
              One link, 188 games, zero downloads. This page is a design concept for start.ng,
              made to be shared.
            </p>
          </div>

          <div className="share-actions">
            <button type="button" className="share-btn" onClick={copy}>
              <span aria-hidden="true">🔗</span> Copy the link
            </button>
            <a
              className="share-btn"
              href={`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SITE}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">💬</span> WhatsApp
            </a>
            <a
              className="share-btn"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                SHARE_TEXT,
              )}&url=${encodeURIComponent(SITE)}`}
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">✳</span> Post it
            </a>
          </div>

          <p className={`share-toast${toast ? ' is-on' : ''}`} role="status">
            Copied — now go and beat my Danfo Dash score.
          </p>
        </div>
      </Reveal>

      <Confetti burst={burst} />
    </section>
  );
}
