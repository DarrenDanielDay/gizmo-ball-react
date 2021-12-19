import type { MapItem } from "../map-items/schemas";
import type { Circle, Polygon, Vector2D } from "./schema";
import { hasOverlap, last, ProjectionRange } from "./utils";
import { add, distance, projection, rotate, substract } from "./vector";

export const polygonCollidesWithPolygon = (polygon1: Polygon, polygon2: Polygon): boolean => {
  const axes = [...getAxes(polygon1.vertexes), ...getAxes(polygon2.vertexes)];
  const absoluteVertexes1 = absoluteVertexes(polygon1);
  const absoluteVertexes2 = absoluteVertexes(polygon2);
  return axes.every((axis) => hasOverlap(projectVertexes(absoluteVertexes1, axis), projectVertexes(absoluteVertexes2, axis)));
};

export const polygonCollidesWithCircle = (polygon: Polygon, circle: Circle): boolean => {
  const circleCenter = circle.center;
  const polygonAbsoluteVertexes = absoluteVertexes(polygon);
  const closestPoint = getPolygonPointClosestToCircle(polygonAbsoluteVertexes, circleCenter);
  const axes = getAxes(polygon.vertexes);
  axes.push(substract(closestPoint, circleCenter));
  return axes.every((axis) => hasOverlap(projectCircle(circle, axis), projectVertexes(polygonAbsoluteVertexes, axis)));
};

export const circleCollidesWithCircle = (circle1: Circle, circle2: Circle) =>
  distance(circle1.center, circle2.center) < circle1.radius + circle2.radius;

type Collider = MapItem["collider"];

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
};

export const hasAnyCollision = (colliders: Collider[]) =>
  colliders.some((a, i) => {
    for (let j = i + 1; j < colliders.length; j++) {
      const b = colliders[j];
      if (collides(a, b)) {
        return true;
      }
    }
    return false;
  });

const absoluteVertexes = (polygon: Polygon) => polygon.vertexes.map((v) => add(polygon.center, v));

const getPolygonPointClosestToCircle = (polygonAbsoluteVertexes: Vector2D[], circleCenter: Vector2D) => {
  let closestPoint = polygonAbsoluteVertexes[0]!;
  let min = distance(closestPoint, circleCenter);
  // Clearer logic with Array.prototype.reduce
  for (const point of polygonAbsoluteVertexes) {
    const length = distance(point, circleCenter);
    if (min > length) {
      min = length;
      closestPoint = point;
    }
  }
  return closestPoint;
};

const getAxes = (vertexes: Vector2D[]) => vertexes.map((v, i, arr) => rotate(substract(v, arr[last(arr.length, i)]!)));

const projectVertexes = (absoluteVertexes: Vector2D[], axis: Vector2D): ProjectionRange => {
  const projections = absoluteVertexes.map((v) => projection(v, axis));
  return [Math.min(...projections), Math.max(...projections)];
};

const projectCircle = (circle: Circle, axis: Vector2D): ProjectionRange => {
  const shadow = projection(circle.center, axis);
  return [shadow - circle.radius, shadow + circle.radius];
};
