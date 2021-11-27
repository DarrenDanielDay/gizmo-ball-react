import React from "react";
import zoomIn from "../../img/zoom-in.png";
import remove from "../../img/remove.png";
import rotate from "../../img/rotate.png";
import zoomOut from "../../img/zoom-out.png";
import styles from "./style.module.css";

export const ToolCollection: React.FC = () => {
  return (
    <div>
      <span>Tool Collection</span>
      <table width="250px">
        <tbody>
          <tr>
            <td>
              <img className={styles.tool} src={rotate} />
            </td>
            <td>
              <img className={styles.tool} src={remove} />
            </td>
          </tr>
          <tr>
            <td>
              <img className={styles.tool} src={zoomIn} />
            </td>
            <td>
              <img className={styles.tool} src={zoomOut} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
