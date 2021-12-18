import { tick } from "../constants/map-items";
import type { MassPoint, Vector2D } from "./schema";
import { add, dot, multiply, norm, projectionComponent, rotate, substract, unitization } from "./vector";

export const surfaceVelocityReflect = (massPoint: MassPoint, axis: Vector2D): MassPoint => {
  const { v, p } = massPoint;
  if (dot(v, axis) < 0) {
    return {
      ...massPoint,
      p: add(p, multiply(v, -tick)),
      v: add(multiply(projectionComponent(v, axis), -2), v),
    };
  }
  return massPoint;
};

export const perfectElasticCollision = (massPoint1: MassPoint, massPoint2: MassPoint): [MassPoint, MassPoint] => {
  const axis = substract(massPoint2.p, massPoint1.p);
  const { v: v1, m: m1 } = massPoint1;
  const { v: v2, m: m2 } = massPoint2;
  if (dot(axis, v1) > 0) {
    const reflectLine = rotate(axis);
    const v1t = projectionComponent(v1, axis);
    const v1n = projectionComponent(v1, reflectLine);
    const v2t = projectionComponent(v2, axis);
    const v2n = projectionComponent(v2, reflectLine);
    const newV1t = add(multiply(v1t, (m1 - m2) / (m1 + m2)), multiply(v2t, (2 * m2) / (m1 + m2)));
    const newV2t = add(multiply(v2t, (m2 - m1) / (m2 + m1)), multiply(v1t, (2 * m1) / (m2 + m1)));
    return [
      {
        ...massPoint1,
        v: add(newV1t, v1n),
      },
      {
        ...massPoint2,
        v: add(newV2t, v2n),
      },
    ];
  }
  return [massPoint1, massPoint2];
};

export const centripetalAcceleration = (massPoint: MassPoint, radius: number, center: Vector2D): Vector2D => {
  const { v, p } = massPoint;
  const value = dot(v, v) / radius;
  return multiply(unitization(substract(center, p)), value);
};

export const constraint = (v: Vector2D, maxLength: number): Vector2D => {
  const length = norm(v);
  if (length > maxLength) {
    return multiply(v, maxLength / length);
  }
  return v;
}

export const maxV = 200;

export const changeOnTick = (massPoint: MassPoint): MassPoint => {
  const { v, a, p } = massPoint;
  return {
    ...massPoint,
    v: constraint(add(v, multiply(a, tick)), maxV),
    p: add(p, multiply(v, tick))
  }
}