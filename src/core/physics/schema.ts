export interface Vector2D {
  x: number;
  y: number;
}

export interface MassPoint {
  p: Vector2D;
  v: Vector2D;
  a: Vector2D;
}

interface BaseShape {
  center: Vector2D;
}

export interface Circle extends BaseShape {
  radius: number;
}

export interface Polygon extends BaseShape {
  /**
   * Not absolute coordinates but offsets relative to center.
   * 
   * The order of vertexes should be counterclockwise in right hand coordinate system.
   */
  vertexes: Vector2D[];
}

export interface Square extends Polygon {
  vertexes: [Vector2D, Vector2D, Vector2D, Vector2D];
}

export interface Triangle extends Polygon {
  vertexes: [Vector2D, Vector2D, Vector2D];
}