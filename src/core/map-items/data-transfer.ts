import type { Vector2D } from "../physics/schema";
import type { MapItem } from "./schemas";

export interface MapItemTransferData {
  item: MapItem;
  from: "collection" | "panel";
  pickedUpPosition?: Vector2D;
}

export const setDataToTransfer = (dataTransfer: DataTransfer, data: MapItemTransferData) => {
  dataTransfer.setData("application/gizmo.mapitem", JSON.stringify(data));
};

export const getDataFromTransfer = (dataTransfer: DataTransfer): MapItemTransferData | undefined => {
  try {
    return JSON.parse(dataTransfer.getData("application/gizmo.mapitem"));
  } catch (error) {
    return undefined;
  }
};
