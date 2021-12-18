import absorber from "../../img/absorber.png";
import ball from "../../img/ball.png";
import circle from "../../img/circle.png";
import pipeNormal from "../../img/pipe_normal.png";
import pipeTurned from "../../img/pipe_turned.png";
import select from "../../img/select.png";
import square from "../../img/square.png";
import triangle from "../../img/triangle.png";
import baffle from "../../img/baffle.png";
import baffleMid from "../../img/baffle-mid.png";
import type { MapItemNames } from "../map-items/schemas";

export type OperationItemNames = 'select' | MapItemNames

export const ItemImageMap: Record<MapItemNames, string> = {
  "baffle-alpha": baffle,
  "baffle-beta": baffle,
  "pipe-turned": pipeTurned,
  absorber: absorber,
  ball: ball,
  border: "",
  circle: circle,
  pipe: pipeNormal,
  square: square,
  triangle: triangle,
};
export const ItemCollectionImageMap: Record<OperationItemNames, string> = {
  "baffle-alpha": baffleMid,
  "baffle-beta": baffleMid,
  "pipe-turned": pipeTurned,
  absorber: absorber,
  ball: ball,
  border: "",
  circle: circle,
  pipe: pipeNormal,
  select: select,
  square: square,
  triangle: triangle,
};

export const tick = 0.025;

export const gridLength = 36;