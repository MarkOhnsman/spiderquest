export const RANKS = [
  { level: 1, name: "Backyard Hero", minXP: 0 },
  { level: 2, name: "Web-Slinger", minXP: 300 },
  { level: 3, name: "Wall-Crawler", minXP: 700 },
  { level: 4, name: "Web Warrior", minXP: 1400 },
  { level: 5, name: "Spectacular Spider", minXP: 2400 },
  { level: 6, name: "Amazing Spider", minXP: 3800 },
  { level: 7, name: "Spider-Verse Legend", minXP: 5600 },
];

export function getRank(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXP) rank = r;
  }
  return rank;
}

export function getNextRank(currentLevel) {
  return RANKS.find((r) => r.level === currentLevel + 1) || null;
}
