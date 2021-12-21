import type { Vector2D } from "./schema";

export const vector = (x: number, y: number): Vector2D => ({ x, y });

export const zero: Vector2D = Object.freeze(vector(0, 0));

export const add = (a: Vector2D, b: Vector2D) => vector(a.x + b.x, a.y + b.y);

export const substract = (a: Vector2D, b: Vector2D) => vector(a.x - b.x, a.y - b.y);

export const multiply = (v: Vector2D, n: number) => vector(v.x * n, v.y * n);

export const unitization = (v: Vector2D) => multiply(v, 1 / dot(v, v));

export const dot = (v1: Vector2D, v2: Vector2D) => v1.x * v2.x + v1.y * v2.y;

export const projection = (v1: Vector2D, v2: Vector2D) => dot(v1, v2) / norm(v2);

export const projectionComponent = (v: Vector2D, axis: Vector2D) => multiply(axis, dot(v, axis) / dot(axis, axis));

export const norm = (v: Vector2D) => Math.sqrt(dot(v, v));

export const distance = (v1: Vector2D, v2: Vector2D) => Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);

export const rotate = (v: Vector2D) => vector(-v.y, v.x);
