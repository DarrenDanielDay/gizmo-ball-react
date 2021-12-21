import { tick, maxV } from "../constants/physics";
import type { MassPoint, PhysicalEffect, Vector2D } from "./schema";
import { add, dot, multiply, norm, projectionComponent, rotate, substract, unitization } from "./vector";

export const surfaceReflectEffect = (massPoint: MassPoint, axis: Vector2D): PhysicalEffect => {
  const { v } = massPoint;
  if (dot(v, axis) < 0) {
    const dv = multiply(projectionComponent(v, axis), -2);
    return {
      // TODO no bumb into
      // dp: multiply(v, -tick),
      dv,
    };
  }
  return {};
};

export const perfectElasticCollisionEffect = (
  massPoint1: MassPoint,
  massPoint2: MassPoint,
): [PhysicalEffect, PhysicalEffect] => {
  const axis = substract(massPoint2.p, massPoint1.p);
  const { v: v1, m: m1 } = massPoint1;
  const { v: v2, m: m2 } = massPoint2;
  if (dot(axis, v1) > 0) {
    const v1t = projectionComponent(v1, axis);
    const v2t = projectionComponent(v2, axis);
    const sum = m1 + m2;
    const c1 = (2 * m2) / sum;
    const c2 = (2 * m1) / sum;
    const dv1 = multiply(substract(v2t, v1t), c1);
    const dv2 = multiply(substract(v1t, v2t), c2);
    return [{ dv: dv1 }, { dv: dv2 }];
  }
  return [{}, {}];
};

export const centripetalAcceleration = (massPoint: MassPoint, radius: number, center: Vector2D): Vector2D => {
  const { v, p } = massPoint;
  const value = dot(v, v) / radius;
  return multiply(unitization(substract(center, p)), value);
};

const constraint = (v: Vector2D, maxLength: number): Vector2D => {
  const length = norm(v);
  if (length > maxLength) {
    return multiply(v, maxLength / length);
  }
  return v;
};

export const kinematicalEffect = (massPoint: MassPoint): NonNullable<PhysicalEffect> => {
  const { v, a } = massPoint;
  return {
    dv: substract(constraint(add(v, multiply(a, tick)), maxV), v),
    dp: multiply(v, tick),
  };
};
