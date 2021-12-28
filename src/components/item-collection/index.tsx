import React from "react";
import { gridLength, ItemCollectionImageMap, OperationItemNames } from "../../core/constants/map-items";
import { setDataToTransfer } from "../../core/map-items/data-transfer";
import { createMapItem } from "../../core/map-items/factory";
import { zero } from "../../core/physics/vector";
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
              {pair.map((name, j) => (
                <td key={j}>
                  <label className={styles.item}>
                    <input
                      name="chooseItem"
                      checked={name === itemName}
                      type="radio"
                      value={name}
                      onChange={(e) => setItemName?.(e.target.value as never)}
                    ></input>
                    {name === "select" ? (
                      <img className={styles.img} src={ItemCollectionImageMap.select} />
                    ) : (
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
                    )}
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
