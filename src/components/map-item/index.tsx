import classNames from "classnames";
import React, { CSSProperties } from "react";
import { ItemImageMap } from "../../core/constants/map-items";
import { setDataToTransfer } from "../../core/map-items/data-transfer";
import { canRotate, getPosition } from "../../core/map-items/operations";
import { MapItem, MapItemStatus, Rotation } from "../../core/map-items/schemas";
import { vector } from "../../core/physics/vector";
import styles from "./style.module.css";

export interface IMapItemComponentProp {
  mapItem: MapItem;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const rotationMap: Record<Rotation, string> = {
  [Rotation.Up]: styles["rotate-up"],
  [Rotation.Down]: styles["rotate-down"],
  [Rotation.Right]: styles["rotate-right"],
  [Rotation.Left]: styles["rotate-left"],
};

export const MapItemComponent: React.FC<IMapItemComponentProp> = ({ mapItem: item, onClick }) => {
  const { center, size, status } = item;
  const position = getPosition(center, size);
  const rotation = canRotate(item) ? item.rotation : Rotation.Up;
  const geometryStyle: CSSProperties = { left: position.x, top: position.y, width: size.x, height: size.y };
  const selected = status === MapItemStatus.Selected;
  return (
    <img
      draggable={selected}
      className={classNames(
        styles["map-item-boarder"],
        item.status === MapItemStatus.Selected && styles.selected,
        styles["map-item"],
        rotationMap[rotation],
      )}
      onClick={onClick}
      style={geometryStyle}
      onDragStart={(e) => {
        setDataToTransfer(e.dataTransfer, { item, from: "panel", pickedUpPosition: vector(e.pageX, e.pageY) });
      }}
      src={ItemImageMap[item.name]}
    ></img>
  );
};
