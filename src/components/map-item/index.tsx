import classNames from "classnames";
import React from "react";
import { ItemImageMap } from "../../core/constants/map-items";
import { setDataToTransfer } from "../../core/map-items/data-transfer";
import { MapItem, MapItemStatus } from "../../core/map-items/schemas";
import { add, multiply, substract } from "../../core/physics/vector";
import styles from "./style.module.css";

export interface IMapItemComponentProp {
  mapItem: MapItem;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMapItemDragStart?: (mapItem: MapItem) => void;
  onMapItemDragEnd?: (mapItem: MapItem) => void;
}

export const MapItemComponent: React.FC<IMapItemComponentProp> = ({
  mapItem: item,
  onMapItemDragStart,
  onMapItemDragEnd,
  onClick,
}) => {
  const { center, size, status } = item;
  const position = substract(center, multiply(size, 0.5));
  const geometryStyle = { left: position.x, top: position.y, width: size.x, height: size.y };
  const selected = status === MapItemStatus.Selected;
  return (
    <>
      <div
        draggable={selected}
        className={classNames(
          styles["map-item-boarder"],
          item.status === MapItemStatus.Selected && styles.selected,
        )}
        onClick={onClick}
        style={geometryStyle}
        onDragStart={(e) => {
          setDataToTransfer(e.dataTransfer, { item });
          onMapItemDragStart?.(item);
        }}
        onDragEnd={() => {
          onMapItemDragEnd?.(item);
        }}
      ></div>
      <img src={ItemImageMap[item.name]} className={styles["map-item"]} style={geometryStyle}></img>
    </>
  );
};
