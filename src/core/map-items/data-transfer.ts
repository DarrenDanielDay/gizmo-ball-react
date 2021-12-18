import type { MapItem } from "./schemas";

export interface MapItemTransferData {
  item: MapItem;
}

export const setDataToTransfer = (dataTransfer: DataTransfer, data: MapItemTransferData) => {
  dataTransfer.setData("application/gizmo.mapitem", JSON.stringify(data));
};

export const getDataFromTransfer = (dataTransfer: DataTransfer): MapItemTransferData => {
  return JSON.parse(dataTransfer.getData("application/gizmo.mapitem"));
};
