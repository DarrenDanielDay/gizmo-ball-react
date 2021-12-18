import React from "react";
import { GameMainView } from "./views/game-main";

const App: React.FC = () => {
  return (
    <div id="game-container">
      <GameMainView />
    </div>
  );
};

export default App;
