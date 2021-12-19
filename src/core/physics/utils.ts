export type ProjectionRange = [number, number];

export const last = (length: number, index: number) => (index - 1 + length) % length;

export const next = (length: number, index: number) => (index + 1) % length;

export const hasOverlap = (p1: ProjectionRange, p2: ProjectionRange) => p1[1] > p2[0] && p2[1] > p1[0];

export const replaceItemInArray = <T>(array: T[], oldItem: T, newItem: T): T[] => {
  const index = array.indexOf(oldItem);
  return [...array.slice(0, index), newItem, ...array.slice(index + 1)];
};

export const removeItemInArray = <T>(array: T[], target: T): T[] => array.filter(item => item !== target)
