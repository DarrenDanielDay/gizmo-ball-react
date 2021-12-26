import type { MassPoint } from "../physics/schema";
import { dot, vector } from "../physics/vector";

export const maxV = 200;
export const tick = 0.025;
export const gravity = vector(0, 15);
// For debug
// @ts-ignore
window.energy = (point: MassPoint) => dot(point.v, point.v) - 2 * gravity.y * point.p.y