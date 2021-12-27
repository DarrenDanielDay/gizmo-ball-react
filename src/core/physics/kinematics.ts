import { tick, maxV } from "../constants/physics";
import type { FinalPhysicalEffect, MassPoint, PhysicalEffect, Vector2D } from "./schema";
import { zeroEffect } from "./utils";
import { add, dot, multiply, norm, projectionComponent, substract, unitization, zero } from "./vector";



export const surfaceReflectEffect = (massPoint: MassPoint, axis: Vector2D): PhysicalEffect => {
  const { v } = massPoint;
  if (dot(v, axis) < 0) {
    const dv = multiply(projectionComponent(v, axis), -2);
    return {
      dp: zero,
      dv,
      da: zero
    };
  }
  return zeroEffect;
};

export const perfectElasticCollisionEffect = (
  massPoint1: MassPoint,
  massPoint2: MassPoint,
): [PhysicalEffect, PhysicalEffect] => {
  const axis = substract(massPoint2.p, massPoint1.p);
  const { v: v1, m: m1 } = massPoint1;
  const { v: v2, m: m2 } = massPoint2;
  // Relative speed
  const v1v2 = substract(v1, v2);
  if (dot(axis, v1v2) > 0) {
    // If relative speed is same direction, the balls are getting closer.
    const v1t = projectionComponent(v1, axis);
    const v2t = projectionComponent(v2, axis);
    const sum = m1 + m2;
    const c1 = (2 * m2) / sum;
    const c2 = (2 * m1) / sum;
    const dv1 = multiply(substract(v2t, v1t), c1);
    const dv2 = multiply(substract(v1t, v2t), c2);
    return [{ dp: zero, dv: dv1, da: zero }, { dp: zero, dv: dv2, da: zero }];
  }
  // Else they are not getting closer
  return [zeroEffect, zeroEffect];
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

export const kinematicalEffect = (massPoint: MassPoint): FinalPhysicalEffect => {
  const { v, a } = massPoint;
  return {
    da: zero,
    dv: substract(constraint(add(v, multiply(a, tick)), maxV), v),
    dp: add(multiply(v, tick), multiply(a, tick * tick / 2)),
  };
};
