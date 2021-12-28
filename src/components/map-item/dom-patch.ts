import type { CSSProperties } from "react";
import { gridLength } from "../../core/constants/map-items";
import { createMapItem } from "../../core/map-items/factory";
import type { Baffle, MapItem } from "../../core/map-items/schemas";
import { zero } from "../../core/physics/vector";

const delta = gridLength / 2;

export const patchBallDOM = (item: MapItem, img: HTMLImageElement) => {
  const { center } = item;
  const patch: Partial<CSSProperties> = {
    left: `${center.x - delta}px`,
    top: `${center.y - delta}px`,
  };
  Object.assign(img.style, patch);
};

const baffleItem = createMapItem("baffle-alpha", zero, gridLength);
const deltaX = baffleItem.size.x / 2;

export const patchBaffleDOM = (item: Baffle, img: HTMLImageElement) => {
  const { center } = item;
  const patch: Partial<CSSProperties> = {
    left: `${center.x - deltaX}px`,
  };
  Object.assign(img.style, patch);
};
