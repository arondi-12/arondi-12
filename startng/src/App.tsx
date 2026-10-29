import { About } from './components/About';
import { Build } from './components/Build';
import { Footer } from './components/Footer';
import { Games } from './components/Games';
import { HalloweenBanner } from './components/HalloweenBanner';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { Roster } from './components/Roster';
import { Ticker } from './components/Ticker';
import { Tournament } from './components/Tournament';
import { Reveal } from './components/Reveal';
import { useReducedMotion } from './hooks/useReducedMotion';

export default function App() {
  const reduced = useReducedMotion();

  return (
    <div id="top" className={reduced ? 'page is-reduced' : 'page'}>
      <HalloweenBanner />
      <Nav />

      <main>
        <Hero reduced={reduced} />
        <Ticker />
        <Tournament />
        <Games />
        <Roster />
        <Build />
        <About />

        <section className="container cta-band">
          <Reveal>
            <p className="eyebrow">Pick one. Any one.</p>
            <h2>Good vibes. Good games. One tap away.</h2>
            <div className="actions">
              <a className="btn" href="#games">
                Play now
              </a>
              <a className="btn btn--ghost" href="#roster">
                Browse all 188
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
