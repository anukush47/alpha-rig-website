export interface ForgeLevel {
  label: "RECRUIT" | "SOLDIER" | "VETERAN" | "LEGEND" | "ALPHA";
  color: string;
  nextThreshold: number | null;
  prevThreshold: number;
  progress: number; // 0–1 within current tier
}

const TIERS: Array<{
  label: ForgeLevel["label"];
  color: string;
  min: number;
  max: number | null;
}> = [
  { label: "RECRUIT",  color: "#888888", min: 0,     max: 499   },
  { label: "SOLDIER",  color: "#3b82f6", min: 500,   max: 1499  },
  { label: "VETERAN",  color: "#9b59b6", min: 1500,  max: 4999  },
  { label: "LEGEND",   color: "#f59e0b", min: 5000,  max: 9999  },
  { label: "ALPHA",    color: "#c0392b", min: 10000, max: null   },
];

export function getForgeLevel(points: number): ForgeLevel {
  const tier = TIERS.find((t) => t.max === null || points <= t.max) ?? TIERS[TIERS.length - 1];
  const range = tier.max !== null ? tier.max - tier.min + 1 : 1;
  const progress = tier.max === null ? 1 : Math.min((points - tier.min) / range, 1);
  return {
    label:         tier.label,
    color:         tier.color,
    nextThreshold: tier.max !== null ? tier.max + 1 : null,
    prevThreshold: tier.min,
    progress,
  };
}

/** Points needed to reach the next tier (null if already ALPHA) */
export function pointsToNext(points: number): number | null {
  const level = getForgeLevel(points);
  if (!level.nextThreshold) return null;
  return Math.max(0, level.nextThreshold - points);
}
