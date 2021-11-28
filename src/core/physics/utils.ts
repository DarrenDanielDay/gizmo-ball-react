export type ProjectionRange = [number, number];

export const last = (length: number, index: number) => (index - 1 + length) % length;

export const hasOverlap = (p1: ProjectionRange, p2: ProjectionRange) => p1[1] > p2[0] && p2[1] > p1[0];