import React, { useCallback, useContext, useEffect, useReducer, useState } from "react";
import classNames from "classnames";
import styles from "./style.module.css";
import { DOMBoostPlayingGamePanel, EditorGamePanel, PlayingGamePanel } from "../../components/game-panel";
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
  isMovable,
  isStatic,
  moveMapItem,
  rotateItem,
  zoomInReducer,
  zoomItem,
  zoomOutReducer,
} from "../../core/map-items/operations";
import { hasAnyCollision } from "../../core/physics/collider";
import { Mode } from "../../core/controller/schema";
import { createBorder, createMapItem, sizeOfMapItem } from "../../core/map-items/factory";
import type { MapItemTransferData } from "../../core/map-items/data-transfer";
import { SaveLoadService } from "../../services/save-load";

const normalizeToCenter = (pointer: Vector2D, size: Vector2D, length: number) => {
  const offset = multiply(size, 0.5);
  const { x, y } = substract(pointer, offset);
  const normalized = vector(Math.round(x / length) * length, Math.round(y / length) * length);
  return add(normalized, offset);
};

const toggleBoolean = (p: boolean): boolean => !p;
export const GameMainView: React.FC = () => {
  const saveLoad = useContext(SaveLoadService);
  const [itemName, setItemName] = useState<OperationItemNames>("select");
  const [mapItems, _setMapItems] = useState<MapItem[]>(() =>
    createBorder(gridLength, gridXCellCounts, gridYCellCounts),
  );
  const [domMode, toggleDomMode] = useReducer(toggleBoolean, true);
  const setMapItems: React.Dispatch<React.SetStateAction<MapItem[]>> = (action) =>
    _setMapItems((items) => {
      const pendingItems = typeof action === "function" ? action(items) : action;
      const has = hasAnyCollision(pendingItems.map((item) => item.collider));
      return has ? items : pendingItems;
    });
  const selected = mapItems.find((item) => item.status === MapItemStatus.Selected);
  const [mode, setMode] = useState(Mode.Layout);
  const isEditing = mode === Mode.Layout;
  const [paused, setPaused] = useState(false);
  const togglePaused = useCallback(() => setPaused(toggleBoolean), []);
  const handleLayoutMode = useCallback(() => {
    setMode(Mode.Layout);
    setPaused(false);
  }, []);
  const handlePlayMode = useCallback(() => {
    setMode(Mode.Play);
  }, []);
  const handleLoad = useCallback(() => {
    saveLoad
      .load()
      .then((items) => {
        setMapItems(items);
      })
      .catch((error) => {
        alert(error);
      });
  }, [saveLoad]);
  const handleSave = useCallback(() => {
    saveLoad.save(mapItems).catch((error) => {
      alert(error);
    });
  }, [saveLoad, mapItems]);
  const handleGridClick = useCallback(
    (offset: Vector2D) => {
      itemName !== "select" &&
        setMapItems((items) => [
          ...items,
          createMapItem(
            itemName,
            normalizeToCenter(offset, sizeOfMapItem(itemName, gridLength), gridLength),
            gridLength,
          ),
        ]);
    },
    [itemName],
  );
  const handleDropItem = useCallback(
    (data: MapItemTransferData, offset: Vector2D): void => {
      const { item, from } = data;
      setMapItems((items) => {
        const center = normalizeToCenter(offset, item.size, gridLength);
        const droppedItem = moveMapItem(item, center);
        return [...(from === "panel" && selected ? removeItemInArray(items, selected) : items), droppedItem];
      });
    },
    [selected],
  );
  const handleRotateItem = useCallback(() => {
    setMapItems((items) =>
      selected && canRotate(selected) ? replaceItemInArray(items, selected, rotateItem(selected)) : items,
    );
  }, [selected]);
  const handleRemoveItem = useCallback(() => {
    setMapItems((items) => (selected ? removeItemInArray(items, selected) : items));
  }, [selected]);
  const handleZoomInItem = useCallback(() => {
    setMapItems((items) =>
      selected && canZoom(selected) ? replaceItemInArray(items, selected, zoomItem(selected, zoomInReducer)) : items,
    );
  }, [selected]);
  const handleZoomOutItem = useCallback(() => {
    setMapItems((items) =>
      selected && canZoom(selected) ? replaceItemInArray(items, selected, zoomItem(selected, zoomOutReducer)) : items,
    );
  }, [selected]);
  useEffect(() => {
    if (isEditing) {
      const handler = (e: KeyboardEvent): void => {
        const action = e.key.toLocaleLowerCase();
        switch (action) {
          case "delete":
            handleRemoveItem();
            break;
          case "r":
            handleRotateItem();
            break;
          case "=":
            handleZoomInItem();
            break;
          case "-":
            handleZoomOutItem();
            break;
        }
      };
      window.addEventListener("keydown", handler);
      return () => {
        window.removeEventListener("keydown", handler);
      };
    }
    return;
  }, [isEditing, selected]);
  return (
    <div className={styles["game"]}>
      <div className={styles.border}>
        {isEditing ? (
          <EditorGamePanel
            mapItems={mapItems}
            onMapItemsChange={setMapItems}
            onClick={handleGridClick}
            onDropItem={handleDropItem}
          />
        ) : (
          renderPlaying(domMode, paused, mapItems)
        )}
      </div>
      <div className={classNames(styles["right-side"], styles.border)}>
        <div className={classNames(styles["right-top"], styles.border)}>
          <ItemCollection itemName={itemName} setItemName={setItemName} />
        </div>
        <div className={classNames(styles["right-middle"], styles.border)}>
          <ToolCollection
            onRotate={handleRotateItem}
            onRemove={handleRemoveItem}
            onZoomIn={handleZoomInItem}
            onZoomOut={handleZoomOutItem}
          />
        </div>
        <div className={classNames(styles["right-bottom"], styles.border)}>
          <Controls
            mode={mode}
            domMode={domMode}
            paused={paused}
            toggleDomMode={toggleDomMode}
            togglePaused={togglePaused}
            handleLayoutMode={handleLayoutMode}
            handlePlayMode={handlePlayMode}
            handleLoad={handleLoad}
            handleSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

const renderPlaying = (domMode: boolean, paused: boolean, mapItems: MapItem[]) => {
  const movables = mapItems.filter(isMovable).map((item) => ({ ...item, status: MapItemStatus.Normal }));
  const statics = mapItems.filter(isStatic).map((item) => ({ ...item, status: MapItemStatus.Normal }));
  return domMode ? (
    <DOMBoostPlayingGamePanel paused={paused} movables={movables} statics={statics} />
  ) : (
    <PlayingGamePanel paused={paused} movables={movables} statics={statics} />
  );
};
