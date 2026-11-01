export type Game = {
  slug: string;
  name: string;
  by: string;
};

export type FeaturedGame = Game & {
  emoji: string;
  tag: string;
  line: string;
  art: 'rooftop' | 'danfo' | 'jollof' | 'ludo' | 'hangout';
  href: string;
};

/**
 * The five community games in the window. All of them are real entries on
 * start.ng/games; the one-line blurbs are ours.
 */
export const featuredGames: FeaturedGame[] = [
  {
    slug: 'rooftop-rush',
    name: 'Rooftop Rush',
    by: 'Oluwafemi',
    emoji: '🏙️',
    tag: 'Endless runner',
    line: 'Leap across Lagos rooftops before the gap catches you.',
    art: 'rooftop',
    href: 'https://start.ng/games/rooftop-rush',
  },
  {
    slug: 'danfo-defense',
    name: 'Danfo Defense',
    by: 'emmyanz',
    emoji: '🚌',
    tag: 'Arcade',
    line: 'Keep the yellow bus in one piece. Oshodi will not help you.',
    art: 'danfo',
    href: 'https://start.ng/games/danfo-defense',
  },
  {
    slug: 'jollof-rush',
    name: 'Jollof Rush',
    by: 'Y_Aisha',
    emoji: '🍲',
    tag: 'Catch & stack',
    line: 'Catch every plate before it hits the floor. No shaking allowed.',
    art: 'jollof',
    href: 'https://start.ng/games/jollof-rush',
  },
  {
    slug: 'ludo',
    name: 'Ludo',
    by: 'Hamzat',
    emoji: '🎲',
    tag: 'Board',
    line: 'The family classic, minus the argument about the dice.',
    art: 'ludo',
    href: 'https://start.ng/games/ludo',
  },
  {
    slug: 'hangout',
    name: 'The Hangout',
    by: 'start.ng',
    emoji: '👾',
    tag: 'Multiplayer',
    line: 'Walk in with your start.ng character. Someone is always online.',
    art: 'hangout',
    href: 'https://start.ng/hangout',
  },
];

/** Names that scroll along the marquee under the hero. */
export const marqueeGames = [
  'Rooftop Rush',
  'Danfo Defense',
  'Jollof Rush',
  'Ludo',
  'The Hangout',
  'Naija Penalty',
  'Lagos Crossing',
  'Suya Catcher',
  'Owambe',
  'Orb Temple',
  'Market Dash',
  'Whot',
  'Naira Run',
  'Relic Hunter',
];
