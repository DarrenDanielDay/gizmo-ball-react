import React from "react";
import zoomIn from "../../img/zoom-in.png";
import remove from "../../img/remove.png";
import rotate from "../../img/rotate.png";
import zoomOut from "../../img/zoom-out.png";
import styles from "./style.module.css";

export interface ToolCollectionProps {
  onRotate?: () => void;
  onRemove?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const ToolCollection: React.FC<ToolCollectionProps> = ({
  onRotate,
  onRemove,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <div>
      <span>Tool Collection</span>
      <table width="250px">
        <tbody>
          <tr>
            <td>
              <img className={styles.tool} src={rotate} onClick={onRotate} />
            </td>
            <td>
              <img className={styles.tool} src={remove} onClick={onRemove} />
            </td>
          </tr>
          <tr>
            <td>
              <img className={styles.tool} src={zoomIn} onClick={onZoomIn} />
            </td>
            <td>
              <img className={styles.tool} src={zoomOut} onClick={onZoomOut} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
