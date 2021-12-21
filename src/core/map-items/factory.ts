import { gravity } from "../constants/physics";
import type { Vector2D } from "../physics/schema";
import { circle, isoscelesRightTriangle, parallelogram, square } from "../physics/shape";
import { substract, vector, zero } from "../physics/vector";
import { BaseMapItem, BorderMapItem, MapItem, MapItemNames, MapItemStatus, Rotation } from "./schemas";

const basicRay = (length: number) => vector(length, length);

export const sizeOfMapItem = (name: MapItemNames, length: number) => {
  switch (name) {
    case "ball":
    case "absorber":
    case "triangle":
    case "circle":
    case "square":
    case "pipe":
    case "pipe-turned":
      return vector(length, length);
    case "baffle-alpha":
    case "baffle-beta":
      return vector(length * 2, length);
    default:
      throw new Error(`Unknown map item name: ${name}`);
  }
};

export const createMapItem = (name: MapItemNames, center: Vector2D, length: number): MapItem => {
  const basicProps: Omit<BaseMapItem, "name"> = {
    center,
    status: MapItemStatus.Normal,
    size: sizeOfMapItem(name, length),
  };
  switch (name) {
    case "ball":
      return {
        name: "ball",
        ...basicProps,
        collider: circle(center, length / 2),
        massPoint: {
          a: gravity,
          m: 1,
          p: center,
          v: zero,
        },
      };
    case "absorber":
      return {
        name: "absorber",
        ...basicProps,
        collider: square(center, basicRay(length / 2)),
        rotation: Rotation.Up,
        scale: 1,
      };
    case "triangle":
      return {
        name: "triangle",
        ...basicProps,
        collider: isoscelesRightTriangle(center, basicRay(length / 2)),
        rotation: Rotation.Up,
        scale: 1,
      };
    case "circle":
      return {
        name: "circle",
        ...basicProps,
        collider: circle(center, length / 2),
        rotation: Rotation.Up,
        scale: 1,
      };
    case "square":
      return {
        name: "square",
        ...basicProps,
        collider: square(center, basicRay(length / 2)),
        rotation: Rotation.Up,
        scale: 1,
      };
    case "pipe":
      return {
        name: "pipe",
        ...basicProps,
        collider: square(center, basicRay(length / 2)),
        rotation: Rotation.Up,
      };
    case "pipe-turned":
      return {
        name: "pipe-turned",
        ...basicProps,
        collider: square(center, basicRay(length / 2)),
        rotation: Rotation.Up,
      };
    case "baffle-alpha":
    case "baffle-beta":
      const colliderCenter = substract(center, vector(0, 3 * length / 8));
      return {
        name,
        ...basicProps,
        collider: parallelogram(colliderCenter, vector(length * 2, 0), vector(0, length / 4)),
      };
    default:
      throw new Error(`Unknown map item name: ${name}`);
  }
};

export const createBorder = (length: number, xCellCount: number, yCellCount: number): BorderMapItem[] => {
  const width = xCellCount * length;
  const height = yCellCount * length;
  const urdl = [
    [1, 0, 0, -1],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, -1, 0],
  ];
  const result: BorderMapItem[] = [];
  for (const [bx, by, sx, sy] of urdl) {
    const center = vector(
      (bx * width + sx * length) / 2 + (sx > 0 ? width : 0),
      (by * height + sy * length) / 2 + (sy > 0 ? height : 0),
    );
    const size = vector(bx * width + (1 - bx) * length, by * height + (1 - by) * length);
    result.push({
      center,
      size,
      collider: parallelogram(center, vector(size.x, 0), vector(0, size.y)),
      name: "border",
      status: MapItemStatus.Normal,
    });
  }
  return result;
};
