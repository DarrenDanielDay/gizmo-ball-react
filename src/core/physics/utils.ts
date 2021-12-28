import { zero } from "./vector";

export type ProjectionRange = [number, number];

export const lastIndex = (length: number, index: number) => (index - 1 + length) % length;

export const lastElement = <T>(array: T[], index: number) => array[lastIndex(array.length, index)]!;

export const nextIndex = (length: number, index: number) => (index + 1) % length;

export const nextElement = <T>(array: T[], index: number) => array[nextIndex(array.length, index)]!;

export const hasOverlap = (p1: ProjectionRange, p2: ProjectionRange) => p1[1] > p2[0] && p2[1] > p1[0];

export const replaceItemInArray = <T>(array: T[], oldItem: T, newItem: T): T[] => {
  const index = array.indexOf(oldItem);
  return [...array.slice(0, index), newItem, ...array.slice(index + 1)];
};

export const removeItemInArray = <T>(array: T[], target: T): T[] => array.filter((item) => item !== target);

export const zeroEffect = { da: zero, dp: zero, dv: zero };

export const die = (message?: string): never => {
  throw new Error(message);
};
