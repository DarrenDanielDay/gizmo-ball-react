import type { Vector2D, MassPoint, Quadrilateral, Triangle, Circle } from "../physics/schema";

export type MapItemNames =
  | "absorber"
  | "baffle-alpha"
  | "baffle-beta"
  | "ball"
  | "border"
  | "circle"
  | "pipe"
  | "pipe-turned"
  | "square"
  | "triangle";

export enum Rotation {
  Up,
  Right,
  Down,
  Left,
}

export enum MapItemStatus {
  Normal,
  Selected,
}
export interface BaseMapItem {
  name: MapItemNames;
  center: Vector2D;
  status: MapItemStatus
  size: Vector2D;
}

export interface WithScale {
  scale: number;
}

export interface WithRotation {
  rotation: Rotation;
}

export interface BorderMapItem extends BaseMapItem {
  name: "border";
  collider: Quadrilateral;
}

export interface Ball extends BaseMapItem {
  name: "ball";
  collider: Circle;
  massPoint: MassPoint;
}

export interface AbsorberMapItem extends BaseMapItem, WithRotation, WithScale {
  name: "absorber";
  collider: Quadrilateral;
}

export interface TriangleMapItem extends BaseMapItem, WithRotation, WithScale {
  name: "triangle";
  collider: Triangle;
}

export interface CircleMapItem extends BaseMapItem, WithRotation, WithScale {
  name: "circle";
  collider: Circle;
}
export interface SquareMapItem extends BaseMapItem, WithRotation, WithScale {
  name: "square";
  collider: Quadrilateral;
}

export interface PipeMapItem extends BaseMapItem, WithRotation {
  name: "pipe";
  collider: Quadrilateral;
}

export interface PipeTurnedMapItem extends BaseMapItem, WithRotation {
  name: "pipe-turned";
  collider: Quadrilateral;
}

export interface BaffleAlphaMapItem extends BaseMapItem {
  name: "baffle-alpha";
  collider: Quadrilateral;
}

export interface BaffleBetaMapItem extends BaseMapItem {
  name: "baffle-beta";
  collider: Quadrilateral;
}

export type MapItem =
  | Ball
  | BorderMapItem
  | AbsorberMapItem
  | TriangleMapItem
  | CircleMapItem
  | SquareMapItem
  | PipeMapItem
  | PipeTurnedMapItem
  | BaffleAlphaMapItem
  | BaffleBetaMapItem;

export type Baffle = BaffleAlphaMapItem | BaffleBetaMapItem;

export type MovingMapItem = Ball | Baffle;

export type StaticMapItem = Exclude<MapItem, MovingMapItem>

declare global {
  interface DataTransfer {
    getData(format: "application/gizmo.mapitem"): string;
    setData(format: "application/gizmo.mapitem", data: string): void;
  }
}
