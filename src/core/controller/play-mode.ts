import { pipeEntryAcceptProjection, pipeTurnAcceptProjection, rotationDirectionMap } from "../constants/map-items";
import { gravity } from "../constants/physics";
import { pipeTurnedOutlets } from "../map-items/operations";
import type { Baffle, Ball, PolygonColliderMapItem, StaticMapItem } from "../map-items/schemas";
import { reduceClosestPoint } from "../physics/collider";
import { kinematicalEffect, perfectElasticCollisionEffect, surfaceReflectEffect } from "../physics/kinematics";
import type {
  FinalPhysicalEffect,
  MassPoint,
  Polygon,
  Vector2D,
} from "../physics/schema";
import { lastIndex, nextElement, nextIndex, zeroEffect } from "../physics/utils";
import {
  add,
  average,
  distance,
  dot,
  isEqual,
  isParallel,
  isSameDirection,
  norm,
  projection,
  projectionComponent,
  resize,
  rotate,
  substract,
  zero,
} from "../physics/vector";
import type { BallCollisions, ComputedPolygonData } from "./schema";
const __DEV__ = import.meta.env.NODE_ENV === "development";

const reduceMassPointWithEffect = (massPoint: MassPoint, physicalEffect: FinalPhysicalEffect): MassPoint => ({
  ...massPoint,
  p: add(massPoint.p, physicalEffect.dp),
  v: add(massPoint.v, physicalEffect.dv),
  a: add(massPoint.a, physicalEffect.da),
});

const reduceBallsWithEffect = (ball: Ball, effect: FinalPhysicalEffect): Ball => {
  const newPoint = reduceMassPointWithEffect(ball.massPoint, effect);
  return {
    ...ball,
    center: newPoint.p,
    collider: {
      ...ball.collider,
      center: newPoint.p,
    },
    massPoint: newPoint,
  };
};

export const preCompute = (polygon: Polygon): ComputedPolygonData => {
  const absoluteVertexes = polygon.vertexes.map((vertex) => add(vertex, polygon.center));
  const edges = polygon.vertexes.map((vertex, i, arr) => substract(vertex, nextElement(arr, i)));
  const middles = absoluteVertexes.map((vertex, i, arr) => average(vertex, nextElement(arr, i)));
  const axes = edges.map((edge) => rotate(edge));
  const pointProjections = absoluteVertexes.map((absoluteVertex, i) => projection(absoluteVertex, axes[i]!));
  return {
    absoluteVertexes,
    edges,
    middles,
    axes,
    pointProjections,
  };
};

export const reduceNextTickWithPrecomputed = (
  oldBalls: Ball[],
  baffles: Baffle[],
  statics: StaticMapItem[],
  preComputed: Map<PolygonColliderMapItem, ComputedPolygonData>,
): Ball[] => {
  const kinematicalEffects = oldBalls.map((ball) => kinematicalEffect(ball.massPoint));
  const newBalls = oldBalls.map((ball, i) => reduceBallsWithEffect(ball, kinematicalEffects[i]!));
  const polygonData = new Map(preComputed.entries());
  for (const baffle of baffles) {
    polygonData.set(baffle, preCompute(baffle.collider));
  }
  const absorbed: boolean[] = new Array(oldBalls.length).fill(false);
  type CollisionCollection = { [K in BallCollisions["type"]]: Extract<BallCollisions, { type: K }>[] };
  const collisions = oldBalls.map<CollisionCollection>(() => {
    return {
      arc: [],
      inner: [],
      entry: [],
      edge: [],
      point: [],
      ball: [],
    };
  });
  for (let i = 0; i < newBalls.length; i++) {
    const newBall = newBalls[i]!;
    const { collider } = newBall;
    const { center, radius } = collider;
    // For map items except balls:
    ForNotBallItem: for (const notBallItem of [...statics, ...baffles]) {
      if (notBallItem.name === "circle") {
        const { center: circleCenter, radius: circleRadius } = notBallItem.collider;
        const axis = substract(center, circleCenter);
        if (norm(axis) < circleRadius + radius) {
          collisions[i]!.arc.push({
            type: "arc",
            item: notBallItem,
            axis,
          });
        }
        continue;
      }
      // Fot items that are not 'circle', the collider must be polygon.
      const { absoluteVertexes, edges, axes, pointProjections } = polygonData.get(notBallItem)!;
      const total = absoluteVertexes.length;
      const [, d, index] = reduceClosestPoint(absoluteVertexes, center);
      const otherIndex = lastIndex(total, index);
      const restIndex = nextIndex(total, index);
      let innerCount = 0;
      // Only the two edges which are connected to the closest point are considered.
      for (const [p1i, p2i] of [
        [otherIndex, index],
        [index, restIndex],
      ] as const) {
        const p1p = substract(center, absoluteVertexes[p1i]!);
        const p2p = substract(center, absoluteVertexes[p2i]!);
        const edge = edges[p1i]!;
        const axis = axes[p1i]!;
        if (dot(p1p, axis) <= 0) {
          innerCount++;
          // Skip if the center is not on the outside of the edge.
          continue;
        }
        if (
          dot(p1p, edge) < 0 &&
          0 < dot(p2p, edge) &&
          radius > Math.abs(pointProjections[p1i]! - projection(center, axis))
        ) {
          if (notBallItem.name === "absorber") {
            absorbed[i] = true;
            continue ForNotBallItem;
          } else if (notBallItem.name === "pipe") {
            if (isParallel(axis, rotationDirectionMap[notBallItem.rotation])) {
              collisions[i]!.entry.push({
                type: "entry",
                index: p1i,
                item: notBallItem,
                axis,
              });
              continue ForNotBallItem;
            }
          } else if (notBallItem.name === "pipe-turned") {
            // TODO pre compute
            if (pipeTurnedOutlets(notBallItem).some((pointer) => isSameDirection(pointer, axis))) {
              collisions[i]!.entry.push({
                type: "entry",
                index: p1i,
                item: notBallItem,
                axis,
              });
              continue ForNotBallItem;
            }
          }
          collisions[i]!.edge.push({
            type: "edge",
            item: notBallItem,
            index: p1i,
            point: absoluteVertexes[p1i]!,
          });
          // If the ball collides on the edge of polygon, then point collision is not considered.
          continue ForNotBallItem;
        }
      }
      if (innerCount === 2 && (notBallItem.name === "pipe" || notBallItem.name === "pipe-turned")) {
        // Collide in pipe
        collisions[i]!.inner.push({
          type: "inner",
          item: notBallItem,
        });
        continue;
      }
      // If the ball does not collide with the edge, then test point collision
      if (d < radius) {
        if (notBallItem.name === "absorber") {
          absorbed[i] = true;
        } else {
          collisions[i]!.point.push({
            type: "point",
            item: notBallItem,
            point: absoluteVertexes[index]!,
            index,
          });
        }
        continue;
      }
    }
    // For balls:
    for (let j = i + 1; j < newBalls.length; j++) {
      const otherBall = newBalls[j]!;
      const { collider: otherCollider } = otherBall;
      const { center: otherCenter, radius: otherRadius } = otherCollider;
      if (distance(center, otherCenter) < radius + otherRadius) {
        // Collision between balls should be tracked only once.
        collisions[i]!.ball.push({
          type: "ball",
          item: oldBalls[j]!,
          axis: substract(center, otherCenter),
          index: j,
        });
      }
    }
  }
  // First, the final balls are based on the kinematical effects.
  const finalBalls = newBalls.slice();
  // Second, handle ball - ball collisions
  for (let i = 0; i < finalBalls.length; i++) {
    const currentBall = finalBalls[i]!;
    const bcs = collisions[i]!.ball;
    for (const bc of bcs) {
      const { index } = bc;
      if (collisions[i]!.inner.length !== collisions[index]!.inner.length) {
        // If the balls are not both in pipe or outside of pipe, ignore the collision.
        continue;
      }
      const otherBall = finalBalls[index]!;
      const [e1, e2] = perfectElasticCollisionEffect(currentBall.massPoint, otherBall.massPoint);
      finalBalls[i] = reduceBallsWithEffect(currentBall, e1);
      finalBalls[index] = reduceBallsWithEffect(otherBall, e2);
    }
  }
  // Third, compute reflection collision axes.
  const pendingReflectAxes = finalBalls.map((currentBall, i) => {
    const { arc: acs, edge: ecs, point: pcs } = collisions[i]!;
    return [
      ...acs.map((ac) => ac.axis),
      ...ecs.map((ec) => polygonData.get(ec.item)!.axes[ec.index]!),
      ...pcs.reduce<Vector2D[]>((acc, pc) => {
        if (ecs.every((ec) => !isEqual(ec.point, pc.point))) {
          acc.push(substract(currentBall.center, pc.point));
        }
        return acc;
      }, []),
    ];
  });
  // Finally, handle pipe entry / pipe inner normalization and handle reflection
  for (let i = 0; i < finalBalls.length; i++) {
    const currentBall = finalBalls[i]!;
    const { entry, inner } = collisions[i]!;
    const pendingReflectAxis = pendingReflectAxes[i]!;
    const { massPoint } = currentBall;
    const { v } = massPoint;
    if (entry.length) {
      if (__DEV__) {
        if (entry.length !== 1) {
          console.error("invalid entry collisions:", entry);
        }
      }
      const e = entry[0]!;
      const { middles, edges } = polygonData.get(e.item)!;
      const middle = middles[e.index]!;
      const positionDelta = substract(middle, currentBall.center);
      const edgeDirection = edges[i]!;
      if (Math.abs(projection(positionDelta, edgeDirection)) < pipeEntryAcceptProjection && dot(e.axis, v) < 0) {
        const changeToMoveIntoAxis = projectionComponent(positionDelta, edgeDirection);
        // v^2 - v0^2 = 2gh
        const v2 = dot(v, v) + 2 * dot(gravity, changeToMoveIntoAxis);
        if (v2 > 0) {
          const velocity = Math.sqrt(v2);
          const finalV = resize(projectionComponent(v, e.axis), velocity);
          const dv = substract(finalV, v);
          finalBalls[i] = reduceBallsWithEffect(currentBall, {
            da: zero,
            dp: changeToMoveIntoAxis,
            dv,
          });
          continue;
        }
        // Energy is not enough, just do nothing.
      } else if (!inner.length) {
        pendingReflectAxis.push(e.axis);
      }
    }
    if (inner.length) {
      if (__DEV__) {
        if (inner.length !== 1) {
          console.error("invalid inner collision:", inner);
        }
      }
      const inn = inner[0]!;
      const { item } = inn;
      const positionDelta = substract(item.center, currentBall.center);
      if (item.name === "pipe") {
        const pipeLine = rotationDirectionMap[item.rotation];
        const cutDirection = rotate(pipeLine);
        const changeToMoveIntoAxis = projectionComponent(positionDelta, cutDirection);
        const v2 = dot(v, v) + 2 * dot(gravity, changeToMoveIntoAxis);
        if (v2 > 0) {
          const velocity = Math.sqrt(v2);
          const finalV = resize(projectionComponent(v, pipeLine), velocity);
          const dv = substract(finalV, v);
          finalBalls[i] = reduceBallsWithEffect(currentBall, {
            da: zero,
            dp: changeToMoveIntoAxis,
            dv,
          });
        } else if (__DEV__) {
          console.error("impossible!");
        }
      } else {
        // TODO precompute
        const [a, b] = pipeTurnedOutlets(item);
        const proja = Math.abs(dot(a, v));
        const projb = Math.abs(dot(b, v));
        // Comming from currentOn, to turn to cutting
        const [currentOn, cutting] = proja > projb ? [a, b] : [b, a];
        if (Math.abs(projection(positionDelta, currentOn)) < pipeTurnAcceptProjection && dot(currentOn, v) < 0) {
          const changeToMoveIntoAxis = projectionComponent(positionDelta, currentOn);
          const v2 = dot(v, v) + 2 * dot(gravity, changeToMoveIntoAxis);
          if (v2 > 0) {
            const velocity = Math.sqrt(v2);
            const finalV = resize(cutting, velocity);
            const dv = substract(finalV, v);
            finalBalls[i] = reduceBallsWithEffect(currentBall, {
              da: zero,
              dp: changeToMoveIntoAxis,
              dv,
            });
          } else if (__DEV__) {
            console.error("impossible!");
          }
        }
      }
    }
    finalBalls[i] = reduceBallsWithEffect(
      finalBalls[i]!,
      pendingReflectAxis.length
        ? surfaceReflectEffect(currentBall.massPoint, average(...pendingReflectAxis))
        : zeroEffect,
    );
  }
  return finalBalls.filter((_, i) => !absorbed[i]);
};
