import type { Circle, Polygon, Vector2D } from "./schema";
import { hasOverlap, last, type ProjectionRange } from "./utils";
import { add, distance, projection, rotate, substract } from "./vector";


export const polygonCollidesWithCircle = (polygon: Polygon, circle: Circle): boolean => {
  const circleCenter = circle.center;
  const polygonAbsoluteVertexes = absoluteVertexes(polygon);
  const closestPoint = getPolygonPointClosestToCircle(polygonAbsoluteVertexes, circleCenter);
  const axes = getAxes(polygon.vertexes);
  axes.push(substract(closestPoint, circleCenter));
  return axes.some((axis) => 
     hasOverlap(projectCircle(circle, axis), projectVertexes(polygonAbsoluteVertexes, axis))
  )
};

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

/*
const getAxesOfPolygonVertexes = (vertexes: Vector2D[]) => vertexes.map(({x, y}, i, arr) => {
  const { x: lastX, y: lastY } = vertexes[circleLast(arr.length, i)]!;
  return vector(lastY - y, x - lastX);
})
*/

const projectVertexes = (absoluteVertexes: Vector2D[], axis: Vector2D): ProjectionRange => {
  const projections = absoluteVertexes.map(v => projection(v, axis));
  return [Math.min(...projections), Math.max(...projections)];
}

const projectCircle = (circle: Circle, axis: Vector2D): ProjectionRange => {
  const shadow = projection(circle.center, axis);
  return [shadow - circle.radius, shadow + circle.radius]
}