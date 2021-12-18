import React, { useRef } from "react";
import { getDataFromTransfer } from "../../core/map-items/data-transfer";
import { MapItem, MapItemNames, MapItemStatus } from "../../core/map-items/schemas";
import type { Vector2D } from "../../core/physics/schema";
import { replaceItemInArray } from "../../core/physics/utils";
import { substract, vector } from "../../core/physics/vector";
import { MapItemComponent } from "../map-item";
import styles from "./style.module.css";

export interface GamePanelProps {
  mapItems: MapItem[];
  onMapItemsChange?: (mapItems: MapItem[]) => void;
  onDragItemStart?: (name: MapItem) => void;
  onDropItem?: (name: MapItem, offsetPosition: Vector2D) => void;
  onDragEnd?: (mapItem: MapItem) => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({
  mapItems,
  onMapItemsChange,
  onDragItemStart,
  onDragEnd,
  onDropItem,
}) => {
  const panelContainerRef = useRef<HTMLDivElement>(null);
  return (
    <div className={styles["game-panel"]}>
      <div
        ref={panelContainerRef}
        className={styles["game-grid"]}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const mapItemName = getDataFromTransfer(e.dataTransfer);
          const panelEl = panelContainerRef.current!;
          const offset = vector(panelEl.offsetLeft, panelEl.offsetTop);
          onDropItem?.(mapItemName.item, substract(vector(e.pageX, e.pageY), offset));
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
            onMapItemDragEnd={onDragEnd}
            onMapItemDragStart={onDragItemStart}
          />
        ))}
      </div>
    </div>
  );
};
