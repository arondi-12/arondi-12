export type Game = {
  slug: string;
  name: string;
  by: string;
};

export type FeaturedGame = Game & {
  emoji: string;
  tag: string;
  line: string;
  statLabel: string;
  statValue: string;
  art: 'rooftop' | 'danfo' | 'jollof' | 'ludo' | 'hangout';
};

/** The five community games we put in the window this weekend. */
export const featuredGames: FeaturedGame[] = [
  {
    slug: 'rooftop-rush',
    name: 'Rooftop Rush',
    by: 'Oluwafemi',
    emoji: '🏙️',
    tag: 'Endless runner',
    line: 'Leap across Lagos rooftops before the gap catches you.',
    statLabel: 'Community best',
    statValue: '59',
    art: 'rooftop',
  },
  {
    slug: 'danfo-defense',
    name: 'Danfo Defense',
    by: 'emmyanz',
    emoji: '🚌',
    tag: 'Arcade',
    line: 'Keep the yellow bus in one piece. Oshodi will not help you.',
    statLabel: 'Runs today',
    statValue: '12.4k',
    art: 'danfo',
  },
  {
    slug: 'jollof-rush',
    name: 'Jollof Rush',
    by: 'Y_Aisha',
    emoji: '🍲',
    tag: 'Catch & stack',
    line: 'Catch every plate before it hits the floor. No shaking allowed.',
    statLabel: 'Plates caught',
    statValue: '3.1M',
    art: 'jollof',
  },
  {
    slug: 'ludo',
    name: 'Ludo',
    by: 'Hamzat',
    emoji: '🎲',
    tag: 'Board',
    line: 'The family classic, minus the argument about the dice.',
    statLabel: 'Games played',
    statValue: '48k',
    art: 'ludo',
  },
  {
    slug: 'hangout',
    name: 'The Hangout',
    by: 'start.ng',
    emoji: '👾',
    tag: 'Multiplayer',
    line: 'Walk in with your start.ng character. Someone is always online.',
    statLabel: 'Online now',
    statValue: '318',
    art: 'hangout',
  },
];

/** Names that scroll along the ticker under the hero. */
export const tickerGames = [
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
];

export const leaderboard = [
  { rank: 1, player: 'sundaychild', points: 62 },
  { rank: 2, player: 'tunde.exe', points: 61 },
  { rank: 3, player: 'you', points: 59, you: true },
  { rank: 4, player: 'amaka__', points: 57 },
];
