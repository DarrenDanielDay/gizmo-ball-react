import { rotationDirectionMap } from "../constants/map-items";
import { isCircle, isPolygon } from "../physics/collider";
import type { Vector2D } from "../physics/schema";
import { nextElement } from "../physics/utils";
import { add, multiply, negate, rotate, rotateBackward, substract } from "../physics/vector";
import {
  MapItem,
  MapItemNames,
  MovingMapItem,
  PipeMapItem,
  PipeTurnedMapItem,
  Rotation,
  StaticMapItem,
  WithRotation,
  WithScale,
} from "./schemas";

export const canRotate = (item: MapItem): item is Extract<MapItem, WithRotation> =>
  typeof (item as WithRotation).rotation === "number";

const rotations = [Rotation.Up, Rotation.Right, Rotation.Down, Rotation.Left];

export const rotateAs = (v: Vector2D, rotation: Rotation): Vector2D => {
  switch (rotation) {
    case Rotation.Up:
      return v;
    case Rotation.Right:
      return rotate(v);
    case Rotation.Down:
      return negate(v);
    case Rotation.Left:
      return rotateBackward(v);
    default:
      throw new Error("Unknown rotation");
  }
};

export const rotateItem = <T extends Extract<MapItem, WithRotation>>(item: T): T => {
  const { collider, rotation } = item;
  return {
    ...item,
    collider: isPolygon(collider) ? { ...collider, vertexes: collider.vertexes.map((v) => rotate(v)) } : collider,
    rotation: nextElement(rotations, rotation),
  };
};

export const canZoom = (item: MapItem): item is Extract<MapItem, WithScale> =>
  typeof (item as WithScale).scale === "number";

export const getPosition = (center: Vector2D, size: Vector2D) => substract(center, multiply(size, 0.5));

export const getCenter = (position: Vector2D, size: Vector2D) => add(position, multiply(size, 0.5));

const zoom = (v: Vector2D, from: number, to: number) => multiply(multiply(v, 1 / from), to);

export const zoomItem = <T extends Extract<MapItem, WithScale>>(item: T, reduceScale: (scale: number) => number): T => {
  const { collider, scale, size, center } = item;
  const position = getPosition(center, size);
  const newScale = reduceScale(scale);
  const newSize = zoom(size, scale, newScale);
  const newCenter = getCenter(position, newSize);
  return {
    ...item,
    scale: newScale,
    size: newSize,
    center: newCenter,
    collider: isCircle(collider)
      ? { ...collider, center: newCenter, radius: (collider.radius / scale) * newScale }
      : isPolygon(collider)
      ? { ...collider, center: newCenter, vertexes: collider.vertexes.map((v) => zoom(v, scale, newScale)) }
      : collider,
  };
};

export const zoomInReducer = (scale: number) => scale + 1;
export const zoomOutReducer = (scale: number) => Math.max(1, scale - 1);

const movableNames: MapItemNames[] = ["ball", "baffle-alpha", "baffle-beta"];

export const isMovable = (item: MapItem): item is MovingMapItem => movableNames.some((name) => name === item.name);
export const isStatic = (item: MapItem): item is StaticMapItem => !isMovable(item);

export const moveMapItem = (item: MapItem, newCenter: Vector2D): MapItem => {
  if (item.name === "ball") {
    return {
      ...item,
      center: newCenter,
      collider: {
        ...item.collider,
        center: newCenter,
      },
      massPoint: {
        ...item.massPoint,
        p: newCenter,
      },
    };
  }
  const delta = substract(newCenter, item.center);
  // @ts-expect-error
  return {
    ...item,
    center: newCenter,
    collider: { ...item.collider, center: add(item.collider.center, delta) },
  };
};

export const pipeOutlets = (pipe: PipeMapItem): [Vector2D, Vector2D] => [
  rotationDirectionMap[pipe.rotation],
  negate(rotationDirectionMap[pipe.rotation]),
];

export const pipeTurnedOutlets = (pipeTurned: PipeTurnedMapItem): [Vector2D, Vector2D] => {
  const possible1 = rotate(rotationDirectionMap[pipeTurned.rotation]);
  const possible2 = rotate(possible1);
  return [possible1, possible2];
}