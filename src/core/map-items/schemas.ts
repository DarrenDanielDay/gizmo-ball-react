import type { Vector2D, MassPoint } from "../physics/schema";

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

interface BaseMapItem {
  name: MapItemNames;
  center: Vector2D;
}

export interface Ball extends BaseMapItem {
  massPoint: MassPoint;
}
