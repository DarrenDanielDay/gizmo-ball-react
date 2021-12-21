import type { Baffle, Ball, MovingMapItem, StaticMapItem } from "../map-items/schemas";
import {
  circleCollidesWithCircle,
  reduceClosestPoint,
  isCircle,
  isPolygon,
  absoluteVertexes,
  circleCollidesOnEdge,
  polygonCollidesWithCircle,
} from "../physics/collider";
import { kinematicalEffect, perfectElasticCollisionEffect, surfaceReflectEffect } from "../physics/kinematics";
import type { MassPoint, PhysicalEffect } from "../physics/schema";
import { lastElement, nextElement } from "../physics/utils";
import { add, rotate, substract, zero } from "../physics/vector";

const reducePhysicalEffects = (physicalEffects: PhysicalEffect[]): Required<PhysicalEffect> =>
  physicalEffects.reduce<Required<PhysicalEffect>>(
    (accumulate, effect) => ({
      dp: add(accumulate.dp ?? zero, effect.dp ?? zero),
      dv: add(accumulate.dv ?? zero, effect.dv ?? zero),
      da: add(accumulate.da ?? zero, effect.da ?? zero),
    }),
    { da: zero, dp: zero, dv: zero },
  );

const reduceMassPointWithEffect = (massPoint: MassPoint, physicalEffect: Required<PhysicalEffect>): MassPoint => ({
  ...massPoint,
  p: add(massPoint.p, physicalEffect.dp),
  v: add(massPoint.v, physicalEffect.dv),
  a: add(massPoint.a, physicalEffect.da),
});

const reduceBallsWithEffect = (ball: Ball, effect: Required<PhysicalEffect>): Ball => {
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

export const reduceNextTick = (movings: MovingMapItem[], statics: StaticMapItem[]): MovingMapItem[] => {
  const balls = movings.filter((item): item is Ball => item.name === "ball");
  const baffles = movings.filter((item): item is Baffle => item.name === "baffle-alpha" || item.name === "baffle-beta");
  const effects = balls.reduce((map, ball) => {
    map.set(ball, [kinematicalEffect(ball.massPoint)]);
    return map;
  }, new Map<Ball, PhysicalEffect[]>());
  const newBalls = balls.map((ball) => {
    const effect = reducePhysicalEffects(effects.get(ball) ?? []);
    return reduceBallsWithEffect(ball, effect);
  });
  const absorbed = new Set<Ball>();
  for (let i = 0; i < newBalls.length; i++) {
    const oldBall = balls[i]!;
    const currentBallEffects = effects.get(oldBall)!;
    const newBall = newBalls[i]!;
    const { massPoint, center, collider } = newBall;
    const { radius } = collider;
    ForNotBallItem: for (const notBallItem of [...statics, ...baffles]) {
      const { collider: notBallItemCollider, center: notBallItemCenter } = notBallItem;
      if (notBallItem.name === "absorber" && polygonCollidesWithCircle(notBallItem.collider, collider)) {
        absorbed.add(oldBall);
        continue;
      }
      if (isCircle(notBallItemCollider)) {
        if (circleCollidesWithCircle(notBallItemCollider, collider)) {
          currentBallEffects.push(surfaceReflectEffect(massPoint, substract(center, notBallItemCenter)));
          continue;
        }
      }
      if (isPolygon(notBallItemCollider)) {
        const vertexes = absoluteVertexes(notBallItemCollider);
        const [closest, d, index] = reduceClosestPoint(vertexes, center);
        const prev = lastElement(vertexes, index);
        const next = nextElement(vertexes, index);
        for (const [p1, p2] of [
          [prev, closest],
          [closest, next],
        ]) {
          if (circleCollidesOnEdge(collider, p1, p2)) {
            const axis = rotate(substract(p1, p2));
            currentBallEffects.push(surfaceReflectEffect(massPoint, axis));
            continue ForNotBallItem;
          }
        }
        if (d < radius) {
          currentBallEffects.push(surfaceReflectEffect(massPoint, substract(center, closest)));
          continue;
        }
      }
    }
    for (let j = i + 1; j < newBalls.length; j++) {
      const otherNewBall = newBalls[j];
      if (circleCollidesWithCircle(otherNewBall.collider, collider)) {
        const [newBallEffect, otherNewBallEffect] = perfectElasticCollisionEffect(
          newBall.massPoint,
          otherNewBall.massPoint,
        );
        currentBallEffects.push(newBallEffect);
        const otherBallEffects = effects.get(balls[j]!)!;
        otherBallEffects.push(otherNewBallEffect);
      }
    }
  }
  const result: MovingMapItem[] = balls.reduce<Ball[]>((resultBalls, ball) => {
    if (!absorbed.has(ball)) {
      resultBalls.push(reduceBallsWithEffect(ball, reducePhysicalEffects(effects.get(ball)!)));
    }
    return resultBalls;
  }, []);
  return result.concat(baffles);
};
