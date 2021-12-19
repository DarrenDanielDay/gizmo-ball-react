import React, { useState } from "react";
import classNames from "classnames";
import styles from "./style.module.css";
import { GamePanel } from "../../components/game-panel";
import { ItemCollection } from "../../components/item-collection";
import { ToolCollection } from "../../components/tool-collection";
import { Controls } from "../../components/controls";
import { MapItem, MapItemStatus } from "../../core/map-items/schemas";
import type { Vector2D } from "../../core/physics/schema";
import { gridLength, gridXCellCounts, gridYCellCounts, OperationItemNames } from "../../core/constants/map-items";
import { add, multiply, substract, vector } from "../../core/physics/vector";
import { removeItemInArray, replaceItemInArray } from "../../core/physics/utils";
import {
  canRotate,
  canZoom,
  rotateItem,
  zoomInReducer,
  zoomItem,
  zoomOutReducer,
} from "../../core/map-items/operations";
import { hasAnyCollision } from "../../core/physics/collider";
import { Mode } from "../../core/controller/schema";
import { createBorder, createMapItem, sizeOfMapItem } from "../../core/map-items/factory";

const normalizeToCenter = (pointer: Vector2D, size: Vector2D, length: number) => {
  const offset = multiply(size, 0.5);
  const { x, y } = substract(pointer, offset);
  const normalized = vector(Math.round(x / length) * length, Math.round(y / length) * length);
  return add(normalized, offset);
};

export const GameMainView: React.FC = () => {
  const [itemName, setItemName] = useState<OperationItemNames>("select");
  const [mapItems, _setMapItems] = useState<MapItem[]>(() =>
    createBorder(gridLength, gridXCellCounts, gridYCellCounts),
  );
  const setMapItems: React.Dispatch<React.SetStateAction<MapItem[]>> = (action) =>
    _setMapItems((items) => {
      const pendingItems = typeof action === "function" ? action(items) : action;
      const has = hasAnyCollision(pendingItems.map((item) => item.collider));
      return has ? items : pendingItems;
    });
  const selected = mapItems.find((item) => item.status === MapItemStatus.Selected);
  const [mode, setMode] = useState(Mode.Layout);
  const [paused, setPaused] = useState(false);
  const handleLayoutMode = () => {
    setMode(Mode.Layout);
    setPaused(false);
  };
  const handlePlayMode = () => {
    setMode(Mode.Play);
  };
  return (
    <div className={styles["game"]}>
      <div className={styles.border}>
        <GamePanel
          mapItems={mapItems}
          onMapItemsChange={(items) => setMapItems(items)}
          onClick={(offset) => {
            itemName !== "select" &&
              setMapItems((items) => [
                ...items,
                createMapItem(
                  itemName,
                  normalizeToCenter(offset, sizeOfMapItem(itemName, gridLength), gridLength),
                  gridLength,
                ),
              ]);
          }}
          onDropItem={(data, offset) => {
            const { item, from } = data;
            setMapItems((items) => {
              const center = normalizeToCenter(offset, item.size, gridLength);
              // @ts-expect-error
              const droppedItem: MapItem = { ...item, center, collider: { ...item.collider, center } };
              return [...(from === "panel" && selected ? removeItemInArray(items, selected!) : items), droppedItem];
            });
          }}
        />
      </div>
      <div className={classNames(styles["right-side"], styles.border)}>
        <div className={classNames(styles["right-top"], styles.border)}>
          <ItemCollection itemName={itemName} setItemName={setItemName} />
        </div>
        <div className={classNames(styles["right-middle"], styles.border)}>
          <ToolCollection
            onRotate={() => {
              setMapItems((items) =>
                selected && canRotate(selected) ? replaceItemInArray(items, selected, rotateItem(selected)) : items,
              );
            }}
            onRemove={() => {
              setMapItems((items) => (selected ? removeItemInArray(items, selected) : items));
            }}
            onZoomIn={() => {
              setMapItems((items) =>
                selected && canZoom(selected)
                  ? replaceItemInArray(items, selected, zoomItem(selected, zoomInReducer))
                  : items,
              );
            }}
            onZoomOut={() => {
              setMapItems((items) =>
                selected && canZoom(selected)
                  ? replaceItemInArray(items, selected, zoomItem(selected, zoomOutReducer))
                  : items,
              );
            }}
          />
        </div>
        <div className={classNames(styles["right-bottom"], styles.border)}>
          <Controls
            mode={mode}
            paused={paused}
            setPaused={setPaused}
            handleLayoutMode={handleLayoutMode}
            handlePlayMode={handlePlayMode}
          />
        </div>
      </div>
    </div>
  );
};
