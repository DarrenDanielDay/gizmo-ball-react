import React, { useRef } from "react";
import { getDataFromTransfer, MapItemTransferData } from "../../core/map-items/data-transfer";
import { MapItem, MapItemStatus } from "../../core/map-items/schemas";
import type { Vector2D } from "../../core/physics/schema";
import { replaceItemInArray } from "../../core/physics/utils";
import { add, substract, vector } from "../../core/physics/vector";
import { MapItemComponent } from "../map-item";
import styles from "./style.module.css";

export interface GamePanelProps {
  mapItems: MapItem[];
  onMapItemsChange?: (mapItems: MapItem[]) => void;
  onDropItem?: (name: MapItemTransferData, offsetPosition: Vector2D) => void;
  onClick?: (offset: Vector2D) => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({ mapItems, onMapItemsChange, onDropItem, onClick }) => {
  const panelContainerRef = useRef<HTMLDivElement>(null);
  return (
    <div className={styles["game-panel"]}>
      <div
        ref={panelContainerRef}
        className={styles["game-grid"]}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const data = getDataFromTransfer(e.dataTransfer);
          if (!data) {
            return;
          }
          const panelEl = panelContainerRef.current!;
          const panelOffset = vector(panelEl.offsetLeft, panelEl.offsetTop);
          const absolutePickedCenter = add(data.item.center, panelOffset);
          const { pickedUpPosition = absolutePickedCenter } = data;
          const cursorCenterOffset = substract(pickedUpPosition, absolutePickedCenter);
          const absoluteDropPosition = vector(e.pageX, e.pageY);
          const droppedOffset = substract(absoluteDropPosition, panelOffset);
          onDropItem?.(data, substract(droppedOffset, cursorCenterOffset));
        }}
        onClick={(e) => {
          const panelEl = panelContainerRef.current!;
          const panelOffset = vector(panelEl.offsetLeft, panelEl.offsetTop);
          const clickedAbsolutePosition = vector(e.pageX, e.pageY);
          const clickedOffset = substract(clickedAbsolutePosition, panelOffset);
          onClick?.(clickedOffset);
        }}
      >
        {mapItems.map((item, i) => (
          <MapItemComponent
            key={i}
            mapItem={item}
            onClick={() => {
              onMapItemsChange?.(
                replaceItemInArray(
                  mapItems.map((original) =>
                    original === item ? item : { ...original, status: MapItemStatus.Normal },
                  ),
                  item,
                  {
                    ...item,
                    status: item.status === MapItemStatus.Selected ? MapItemStatus.Normal : MapItemStatus.Selected,
                  },
                ),
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};
