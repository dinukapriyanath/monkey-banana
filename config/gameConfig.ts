export const STAGES = [
  {
    id: 1,
    name: "Village Stores",
    description: "Beginner difficulty. Small fruit shops with slow timers.",
    timer: 20,
    emoji: "🏘️",
    levels: [
      { id: 1, name: "Small Banana Stall", globalLevel: 1 },
      { id: 2, name: "Village Fruit Shop", globalLevel: 2 },
    ],
  },
  {
    id: 2,
    name: "City Markets",
    description: "Harder puzzles. Supermarkets, security cameras, busy city vibe.",
    timer: 15,
    emoji: "🏙️",
    levels: [
      { id: 3, name: "Mini Market", globalLevel: 3 },
      { id: 4, name: "City Fruit Market", globalLevel: 4 },
      { id: 5, name: "Big Supermarket", globalLevel: 5 },
    ],
  },
  {
    id: 3,
    name: "Banana Warehouses",
    description: "Final challenge. Industrial warehouses with guards and alarm systems.",
    timer: 10,
    emoji: "🏭",
    levels: [
      { id: 6, name: "Storage Depot", globalLevel: 6 },
      { id: 7, name: "Wholesale Banana Store", globalLevel: 7 },
      { id: 8, name: "Shipping Warehouse", globalLevel: 8 },
      { id: 9, name: "Mega Banana Factory", globalLevel: 9 },
      { id: 10, name: "Golden Banana Vault", globalLevel: 10 },
    ],
  },
]

export const AVATARS = ["🐒", "🦍", "🐵", "🦧", "🐱", "🦊", "🐸", "🦉"]

export const TOTAL_LEVELS = 10

// Get stage + level info from global level number (1-10)
export function getLevelInfo(globalLevel: number) {
  for (const stage of STAGES) {
    for (const level of stage.levels) {
      if (level.globalLevel === globalLevel) {
        return { stage, level }
      }
    }
  }
  return null
}

// Get the next level
export function getNextLevel(globalLevel: number): number | null {
  if (globalLevel >= TOTAL_LEVELS) return null
  return globalLevel + 1
}

// Get stage for a global level
export function getStageForLevel(globalLevel: number) {
  return STAGES.find((s) => s.levels.some((l) => l.globalLevel === globalLevel))
}
