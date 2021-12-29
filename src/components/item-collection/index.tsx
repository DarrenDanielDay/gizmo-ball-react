import React from "react";
import { gridLength, ItemCollectionImageMap, OperationItemNames } from "../../core/constants/map-items";
import { BaffleKey } from "../../core/controller/schema";
import { setDataToTransfer } from "../../core/map-items/data-transfer";
import { createMapItem } from "../../core/map-items/factory";
import { zero } from "../../core/physics/vector";
import { Tooltip } from "../tooltip";
import styles from "./style.module.css";

const itemOrders: [OperationItemNames, OperationItemNames][] = [
  ["select", "ball"],
  ["absorber", "triangle"],
  ["circle", "square"],
  ["pipe", "pipe-turned"],
  ["baffle-alpha", "baffle-beta"],
];

export interface ItemCollectionProps {
  itemName: OperationItemNames;
  setItemName?: React.Dispatch<React.SetStateAction<OperationItemNames>>;
}

export const ItemCollection: React.FC<ItemCollectionProps> = ({ itemName, setItemName }) => {
  return (
    <div className={styles["item-zone"]}>
      <span>Item Collection</span>
      <table width="250px">
        <tbody>
          {itemOrders.map((pair, i) => (
            <tr key={i} className={styles["two-item"]}>
              {pair.map((name, j) => {
                return (
                  <td key={j}>
                    <label className={styles.item}>
                      <input
                        name="chooseItem"
                        checked={name === itemName}
                        type="radio"
                        value={name}
                        onChange={(e) => setItemName?.(e.target.value as never)}
                      ></input>
                      {renderMapItemOption(name)}
                    </label>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const renderMapItemOption = (name: OperationItemNames): React.ReactNode => {
  if (name === "select") {
    return <img className={styles.img} src={ItemCollectionImageMap.select} />;
  }
  const mapItemImg = (
    <img
      className={styles.img}
      onDragStart={(e) => {
        setDataToTransfer(e.dataTransfer, {
          item: createMapItem(name, zero, gridLength),
          from: "collection",
        });
      }}
      src={ItemCollectionImageMap[name]}
    />
  );
  return name === "baffle-alpha"
    ? baffleTooltip(BaffleKey.AlphaLeft, BaffleKey.AlphaRight, mapItemImg)
    : name === "baffle-beta"
    ? baffleTooltip(BaffleKey.BetaLeft, BaffleKey.BetaRight, mapItemImg)
    : mapItemImg;
};

const baffleTooltip = (k1: string, k2: string, img: React.ReactNode) => {
  return (
    <Tooltip
      tooltip={
        <div className={styles["baffle-control-hint"]}>
          <p>Play Mode Control Key:</p>
          <p>
            Key <kbd>{k1.toUpperCase()}</kbd> For moving left
          </p>
          <p>
            Key <kbd>{k2.toUpperCase()}</kbd> For moving right
          </p>
        </div>
      }
    >
      {img}
    </Tooltip>
  );
};
