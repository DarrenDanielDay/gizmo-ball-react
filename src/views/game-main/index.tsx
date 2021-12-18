import React, { useState } from "react";
import classNames from "classnames";
import styles from "./style.module.css";
import { GamePanel } from "../../components/game-panel";
import { ItemCollection } from "../../components/item-collection";
import { ToolCollection } from "../../components/tool-collection";
import { Controls } from "../../components/controls";
import type { MapItem, MapItemNames } from "../../core/map-items/schemas";
import { createMapItem, sizeOfMapItem } from "../../core/map-items/factory";
import type { Vector2D } from "../../core/physics/schema";
import { gridLength } from "../../core/constants/map-items";
import { add, multiply, substract, vector } from "../../core/physics/vector";
import { removeItemInArray } from "../../core/physics/utils";

const normalizeToCenter = (pointer: Vector2D, size: Vector2D, length: number) => {
  const offset = multiply(size, 0.5);
  const { x, y } = substract(pointer, offset);
  const normalized = vector(Math.round(x / length) * length, Math.round(y / length) * length);
  return add(normalized, offset);
};

export const GameMainView: React.FC = () => {
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  return (
    <div className={styles["game"]}>
      <div className={styles.border}>
        <GamePanel
          mapItems={mapItems}
          onMapItemsChange={setMapItems}
          onDragEnd={(item) => {
            setMapItems(removeItemInArray(mapItems, item));
          }}
          onDropItem={(item, offset) => {
            setMapItems((items) => [...items, { ...item, center: normalizeToCenter(offset, item.size, gridLength) }]);
          }}
        />
      </div>
      <div className={classNames(styles["right-side"], styles.border)}>
        <div className={classNames(styles["right-top"], styles.border)}>
          <ItemCollection />
        </div>
        <div className={classNames(styles["right-middle"], styles.border)}>
          <ToolCollection />
        </div>
        <div className={classNames(styles["right-bottom"], styles.border)}>
          <Controls />
        </div>
      </div>
    </div>
  );
};
