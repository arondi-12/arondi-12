import { AboutFaq } from './components/AboutFaq';
import { BuildSteps } from './components/BuildSteps';
import { DanfoDash } from './components/DanfoDash';
import { GameShelf } from './components/GameShelf';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Mascot } from './components/Mascot';
import { Nav } from './components/Nav';
import { RosterShelf } from './components/RosterShelf';
import { ShareBand } from './components/ShareBand';
import { SiteFooter } from './components/SiteFooter';
import { TapeStrip } from './components/TapeStrip';
import { Tournament } from './components/Tournament';

export default function App() {
  return (
    <div id="top" className="page">
      <a className="skip-link" href="#main">
        Skip to the games
      </a>

      <TapeStrip />
      <Nav />

      <main id="main">
        <Hero />
        <Marquee />
        <DanfoDash />
        <GameShelf />
        <RosterShelf />
        <Tournament />
        <BuildSteps />
        <AboutFaq />
        <ShareBand />
      </main>

      <SiteFooter />
      <Mascot />
    </div>
  );
}
