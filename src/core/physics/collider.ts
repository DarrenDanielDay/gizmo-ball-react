import type { MapItem } from "../map-items/schemas";
import type { Circle, Polygon, Vector2D } from "./schema";
import { die, hasOverlap, lastElement, ProjectionRange } from "./utils";
import { add, distance, dot, isZero, norm, projection, rotate, substract } from "./vector";

export const polygonCollidesWithPolygon = (polygon1: Polygon, polygon2: Polygon): boolean => {
  const axes = [...getAxes(polygon1.vertexes), ...getAxes(polygon2.vertexes)];
  const absoluteVertexes1 = absoluteVertexes(polygon1);
  const absoluteVertexes2 = absoluteVertexes(polygon2);
  return axes.every((axis) =>
    hasOverlap(projectVertexes(absoluteVertexes1, axis), projectVertexes(absoluteVertexes2, axis)),
  );
};

export const noSeperationWithZero = (
  axes: Vector2D[],
  circle: Circle,
  polygonAbsoluteVertexes: Vector2D[],
): boolean => {
  return axes.every(
    (axis) => !isZero(axis) && hasOverlap(projectCircle(circle, axis), projectVertexes(polygonAbsoluteVertexes, axis)),
  );
};

export const polygonCollidesWithCircle = (polygon: Polygon, circle: Circle): boolean => {
  const circleCenter = circle.center;
  const polygonAbsoluteVertexes = absoluteVertexes(polygon);
  const [closestPoint] = reduceClosestPoint(polygonAbsoluteVertexes, circleCenter);
  const axes = getAxes(polygon.vertexes);
  axes.push(substract(closestPoint, circleCenter));
  return noSeperationWithZero(axes, circle, polygonAbsoluteVertexes);
};

export const circleCollidesOnEdge = (circle: Circle, p1: Vector2D, p2: Vector2D) => {
  const { center, radius } = circle;
  const p1p = substract(center, p1);
  const p2p = substract(center, p2);
  const edge = substract(p1, p2);
  const axis = rotate(edge);
  if (dot(p1p, axis) <= 0) {
    // center is in the inside of edge
    return false;
  }
  return (
    dot(p1p, edge) < 0 && 0 < dot(p2p, edge) && radius >= Math.abs(projection(center, axis) - projection(p1, axis))
  );
};
export const circleCollidesWithCircle = (circle1: Circle, circle2: Circle) =>
  distance(circle1.center, circle2.center) < circle1.radius + circle2.radius;

export type Collider = MapItem["collider"];

export const isPolygon = (collider: Collider): collider is Extract<Collider, Polygon> =>
  Array.isArray((collider as Polygon).vertexes);
export const isCircle = (collider: Collider): collider is Circle => typeof (collider as Circle).radius === "number";

export const collides = (a: Collider, b: Collider) => {
  const aIsPolygon = isPolygon(a);
  const bIsPolygon = isPolygon(b);
  const aIsCircle = isCircle(a);
  const bIsCircle = isCircle(b);
  if (aIsPolygon && bIsPolygon) {
    return polygonCollidesWithPolygon(a, b);
  }
  if (aIsCircle && bIsCircle) {
    return circleCollidesWithCircle(a, b);
  }
  if (aIsCircle && bIsPolygon) {
    return polygonCollidesWithCircle(b, a);
  }
  if (aIsPolygon && bIsCircle) {
    return polygonCollidesWithCircle(a, b);
  }
  return die("Unknown collider combination.");
};

export const hasAnyCollision = (colliders: Collider[]) =>
  colliders.some((a, i) => {
    for (let j = i + 1; j < colliders.length; j++) {
      const b = colliders[j]!;
      if (collides(a, b)) {
        return true;
      }
    }
    return false;
  });

export const absoluteVertexes = (polygon: Polygon) => polygon.vertexes.map((v) => add(polygon.center, v));

export const reduceClosestPoint = (points: Vector2D[], origin: Vector2D) =>
  points.reduce<[Vector2D, number, number]>(
    ([closest, length, index], point, i) => {
      const currentLength = distance(point, origin);
      const useCurrent = length >= currentLength;
      return [useCurrent ? point : closest, useCurrent ? currentLength : length, useCurrent ? i : index];
    },
    [null!, Infinity, -1],
  );

const getAxes = (vertexes: Vector2D[]) => vertexes.map((v, i, arr) => rotate(substract(v, lastElement(arr, i))));

const projectVertexes = (absoluteVertexes: Vector2D[], axis: Vector2D): ProjectionRange => {
  const projections = absoluteVertexes.map((v) => projection(v, axis));
  return [Math.min(...projections), Math.max(...projections)];
};

const projectCircle = (circle: Circle, axis: Vector2D): ProjectionRange => {
  const shadow = projection(circle.center, axis);
  return [shadow - circle.radius, shadow + circle.radius];
};

export const detectCircleCollidesWithCircle = (c1: Circle, c2: Circle) => {
  const connector = substract(c1.center, c2.center);
  const d = norm(connector);
  return {
    connector,
    flag: d < c1.radius + c2.radius,
  };
};
