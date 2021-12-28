import React from "react";
import { die } from "../core/physics/utils";
import type { ISaveLoadService } from "./schema";

export const SaveLoadService = React.createContext<ISaveLoadService>({
  load() {
    return die("Method not implemented");
  },
  save() {
    return die("Method not implemented");
  }
});
