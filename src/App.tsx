import React from "react";
import { SaveLoadService } from "./services/save-load";
import { browserSaveLoadService } from "./services/save-load/browser";
import { GameMainView } from "./views/game-main";

const App: React.FC = () => {
  return (
    <div id="game-container">
      <SaveLoadService.Provider value={browserSaveLoadService}>
        <GameMainView />
      </SaveLoadService.Provider>
    </div>
  );
};

export default App;
