import type { Circle, MassPoint, Quadrilateral, Triangle, Vector2D } from "../physics/schema";
import {
  AbsorberMapItem,
  BaffleAlphaMapItem,
  BaffleBetaMapItem,
  Ball,
  BaseMapItem,
  BorderMapItem,
  CircleMapItem,
  MapItem,
  PipeMapItem,
  PipeTurnedMapItem,
  Rotation,
  SquareMapItem,
  TriangleMapItem,
  WithRotation,
  WithScale,
} from "./schemas";

type Validator<T> = (value: unknown) => value is T;
type MapValidatorsToTypes<Validators extends readonly Validator<unknown>[]> = {
  [K in keyof Validators]: Validators[K] extends Validator<infer T> ? T : never;
};
type MapTypesToValidators<Types extends readonly unknown[]> = {
  [K in keyof Types]: Validator<Types[K]>;
};
type UnionToIntersection<U> = (U extends unknown ? (_: U) => void : never) extends (_: infer T) => void ? T : never;
const is =
  <T>(reference: T): Validator<T> =>
  (value: unknown): value is T =>
    Object.is(value, reference);
const isNull: Validator<null> = (value): value is null => value === null;
const isObjectLike = (value: unknown): value is Record<PropertyKey, unknown> =>
  (!isNull(value) && typeof value === "object") || typeof value === "function";
const isNumber: Validator<number> = (value): value is number => typeof value === "number";
const isObject =
  <T extends {}>(schema: { [K in keyof T]: Validator<T[K]> }): Validator<T> =>
  (value: unknown): value is T =>
    isObjectLike(value) &&
    Object.entries<Validator<T[keyof T]>>(schema).every(([key, validator]) => validator(Reflect.get(value, key)));
const isUnionOf =
  <Types extends unknown[]>(...validators: MapTypesToValidators<Types>): Validator<Types[number]> =>
  (value): value is Types[number] =>
    validators.some((validator) => validator(value));
const isIntersectionOf =
  <Types extends readonly unknown[]>(
    ...validators: MapTypesToValidators<Types>
  ): Validator<UnionToIntersection<Types[number]>> =>
  (value): value is UnionToIntersection<Types[number]> =>
    validators.every((validator) => validator(value));
const isTupleOf =
  <Types extends readonly unknown[]>(...validators: MapTypesToValidators<Types>): Validator<Types> =>
  (value: unknown): value is Types =>
    Array.isArray(value) &&
    value.length === validators.length &&
    validators.every((validator, i) => i in value && validator(value[i]));
// @ts-expect-error Conditional type
const isIntersectionThat: <Validators extends readonly Validator<unknown>[]>(
  ...validators: Validators
) => Validator<UnionToIntersection<MapValidatorsToTypes<Validators>[number]>> = isIntersectionOf;
const unchecked = (value: unknown): value is never => !value !== !!value;

const defineValidator = <T>(validator: Validator<T>): Validator<T> => validator;

export const isRotation = (value: unknown): value is Rotation =>
  isNumber(value) && Object.values(Rotation).includes(value);

const isVector = defineValidator<Vector2D>(
  isObject({
    x: isNumber,
    y: isNumber,
  }),
);

export const isBaseMapItem = defineValidator<BaseMapItem>(
  isObject({
    center: isVector,
    name: unchecked,
    size: isVector,
    status: unchecked,
  }),
);

export const isWithScale = defineValidator<WithScale>(
  isObject({
    scale: isNumber,
  }),
);

export const isWithRotation = defineValidator<WithRotation>(
  isObject({
    rotation: isRotation,
  }),
);

export const isQuadrilateral = defineValidator<Quadrilateral>(
  isObject({
    center: isVector,
    vertexes: isTupleOf(isVector, isVector, isVector, isVector),
  }),
);

export const isTriangle = defineValidator<Triangle>(
  isObject({
    center: isVector,
    vertexes: isTupleOf(isVector, isVector, isVector),
  }),
);

export const isCircle = defineValidator<Circle>(
  isObject({
    center: isVector,
    radius: isNumber,
  }),
);

export const isMassPoint = defineValidator<MassPoint>(
  isObject({
    a: isVector,
    m: isNumber,
    p: isVector,
    v: isVector,
  }),
);

const isPartialMapItem = <T extends MapItem>(name: T["name"], collider: Validator<T["collider"]>) =>
  isObject({
    name: is(name),
    collider,
  });

export const isBorderMapItem = defineValidator<BorderMapItem>(
  isIntersectionThat(isBaseMapItem, isPartialMapItem<BorderMapItem>("border", isQuadrilateral)),
);

export const isBall = defineValidator<Ball>(
  isIntersectionThat(isBaseMapItem, isPartialMapItem<Ball>("ball", isCircle), isObject({ massPoint: isMassPoint })),
);

export const isAbsorberMapItem = defineValidator<AbsorberMapItem>(
  isIntersectionThat(
    isBaseMapItem,
    isWithRotation,
    isWithScale,
    isPartialMapItem<AbsorberMapItem>("absorber", isQuadrilateral),
  ),
);

export const isTriangleMapItem = defineValidator<TriangleMapItem>(
  isIntersectionThat(
    isBaseMapItem,
    isWithRotation,
    isWithScale,
    isPartialMapItem<TriangleMapItem>("triangle", isTriangle),
  ),
);

export const isCircleMapItem = defineValidator<CircleMapItem>(
  isIntersectionThat(isBaseMapItem, isWithRotation, isWithScale, isPartialMapItem<CircleMapItem>("circle", isCircle)),
);

export const isSquareMapItem = defineValidator<SquareMapItem>(
  isIntersectionThat(
    isBaseMapItem,
    isWithRotation,
    isWithScale,
    isPartialMapItem<SquareMapItem>("square", isQuadrilateral),
  ),
);

export const isPipeMapItem = defineValidator<PipeMapItem>(
  isIntersectionThat(isBaseMapItem, isWithRotation, isPartialMapItem<PipeMapItem>("pipe", isQuadrilateral)),
);

export const isPipeTurnedMapItem = defineValidator<PipeTurnedMapItem>(
  isIntersectionThat(
    isBaseMapItem,
    isWithRotation,
    isPartialMapItem<PipeTurnedMapItem>("pipe-turned", isQuadrilateral),
  ),
);

export const isBaffleAlphaMapItem = defineValidator<BaffleAlphaMapItem>(
  isIntersectionThat(isBaseMapItem, isPartialMapItem<BaffleAlphaMapItem>("baffle-alpha", isQuadrilateral)),
);
export const isBaffleBetaMapItem = defineValidator<BaffleBetaMapItem>(
  isIntersectionThat(isBaseMapItem, isPartialMapItem<BaffleBetaMapItem>("baffle-beta", isQuadrilateral)),
);

export const isMapItem = defineValidator<MapItem>(
  isUnionOf(
    isBall,
    isBorderMapItem,
    isAbsorberMapItem,
    isTriangleMapItem,
    isCircleMapItem,
    isSquareMapItem,
    isPipeMapItem,
    isPipeTurnedMapItem,
    isBaffleAlphaMapItem,
    isBaffleBetaMapItem,
  ),
);
