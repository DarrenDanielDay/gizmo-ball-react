import type { MapItem } from "../core/map-items/schemas";

export interface ISaveLoadService {
  /**
   * Save mapitem to somewhere.
   * @param items mapitem
   */
  save(items: MapItem[]): Promise<void>;
  /**
   * Load mapitem from somewhere.
   * The returned promise should be rejected when failed to load.
   */
  load(): Promise<MapItem[]>;
}