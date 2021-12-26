import type {
  Ball,
  CircleMapItem,
  MapItem,
  PipeMapItem,
  PipeTurnedMapItem,
  PolygonColliderMapItem,
} from "../map-items/schemas";
import type { Vector2D } from "../physics/schema";

export enum Mode {
  Play,
  Layout,
}

export enum BaffleKey {
  AlphaLeft = "a",
  AlphaRight = "d",
  BetaLeft = "j",
  BetaRight = "l",
}

interface BaseCollision {
  type: string;
  item: MapItem;
}

export interface EdgeCollision extends BaseCollision {
  type: "edge";
  item: PolygonColliderMapItem;
  point: Vector2D; // closest point of the edge
  index: number;
}

export interface PipeEntryCollision extends BaseCollision {
  type: 'entry';
  item: PipeMapItem | PipeTurnedMapItem;
  index: number;
  axis: Vector2D;
}


export interface PointCollision extends BaseCollision {
  type: "point";
  item: PolygonColliderMapItem;
  point: Vector2D;
  index: number;
}

export interface ArcCollision extends BaseCollision {
  type: "arc";
  item: CircleMapItem;
  axis: Vector2D;
}

export interface BallCollision extends BaseCollision {
  type: "ball";
  item: Ball;
  axis: Vector2D;
  index: number;
}

export interface InPipeCollision extends BaseCollision {
  type: "inner";
  item: PipeMapItem | PipeTurnedMapItem;
}

export type BallCollisions = BallCollision | EdgeCollision | PipeEntryCollision | PointCollision | ArcCollision | InPipeCollision;

export interface ComputedPolygonData {
  absoluteVertexes: Vector2D[];
  edges: Vector2D[]; // v[i] - v[i + 1]
  middles: Vector2D[]; // average(v[i], v[i + 1])
  axes: Vector2D[]; // rotate(edges[i])
  pointProjections: number[]; // dot(axes[i], v[i])
}
