import type { Circle, Quadrilateral, Triangle, Vector2D } from "./schema";
import { add, multiply, rotate, substract } from "./vector";

export const square = (center: Vector2D, ray: Vector2D): Quadrilateral => {
  const ray2 = rotate(ray);
  const ray3 = rotate(ray2);
  const ray4 = rotate(ray3);
  return {
    center,
    vertexes: [ray, ray2, ray3, ray4],
  };
};

export const isoscelesRightTriangle = (center: Vector2D, ray: Vector2D): Triangle => {
  const ray2 = rotate(ray);
  const ray3 = rotate(ray2);
  return {
    center,
    vertexes: [ray, ray2, ray3],
  };
};

export const parallelogram = (center: Vector2D, a: Vector2D, b: Vector2D): Quadrilateral => {
  const first = multiply(add(a, b), 0.5);
  const second = substract(first, a);
  const third = substract(second, b);
  const forth = add(third, a);
  return {
    center,
    vertexes: [first, second, third, forth],
  };
};

export const circle = (center: Vector2D, radius: number): Circle => ({ center, radius });
