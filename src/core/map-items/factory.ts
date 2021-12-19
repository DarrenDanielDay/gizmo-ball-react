import type { Vector2D } from "../physics/schema";
import { circle, isoscelesRightTriangle, parallelogram, square } from "../physics/shape";
import { vector } from "../physics/vector";
import { BaseMapItem, MapItem, MapItemNames, MapItemStatus, Rotation } from "./schemas";

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
    size: sizeOfMapItem(name, length)
  };
  switch (name) {
    case "ball":
      return {
        name: "ball",
        ...basicProps,
        collider: circle(center, length / 2),
        massPoint: {
          a: vector(0, 0),
          m: 1,
          p: center,
          v: vector(0, 0),
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
      return {
        name: "baffle-alpha",
        ...basicProps,
        collider: parallelogram(center, vector(length * 2, 0), vector(0, length / 4)),
      };
    case "baffle-beta":
      return {
        name: "baffle-beta",
        ...basicProps,
        collider: parallelogram(center, vector(length * 2, 0), vector(0, length / 4)),
      };
    default:
      throw new Error(`Unknown map item name: ${name}`);
  }
};
