import React, { useState } from "react";
import {
  ItemCollectionImageMap,
  OperationItemNames,
} from "../../core/constants/map-items";
import styles from "./style.module.css";

const itemOrders: [OperationItemNames, OperationItemNames][] = [
  ["select", "ball"],
  ["absorber", "triangle"],
  ["circle", "square"],
  ["pipe", "pipe-turned"],
  ["baffle-alpha", "baffle-beta"],
];

export const ItemCollection: React.FC = () => {
  const [itemName, setItemName] = useState<OperationItemNames>("select");
  return (
    <div className={styles["item-zone"]}>
      <span>Item Collection</span>
      <table width="250px">
        <tbody>
          {itemOrders.map((pair, i) => (
            <tr key={i} className={styles["two-item"]}>
              {pair.map((item, i) => (
                <td key={i}>
                  <label className={styles.item}>
                    <input
                      checked={item === itemName}
                      type="radio"
                      value={item}
                      onChange={(e) => setItemName(e.target.value as never)}
                    ></input>
                    <img
                      className={styles.img}
                      draggable={item !== "select"}
                      onDragStart={() => {
                        console.log("drag start!");
                      }}
                      onDragEnd={() => {
                        console.log("drag end!");
                      }}
                      src={ItemCollectionImageMap[item]}
                    />
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
