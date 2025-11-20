import type { VectorKey } from "../types.js";

export type NormalizedVector = Record<string, number>;

export interface Contribution {
  dimension: VectorKey;
  weight: number;
}
