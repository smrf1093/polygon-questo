import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import Game from "./src/game";
import GameOver from "./src/gameOver";
import StartGame from "./src/startGame";
import "core-js/stable";
import "regenerator-runtime/runtime";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 640,
  scene: [StartGame, Game, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 200,
      },
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);

// ReactDOM.render(
//   <App />,
//   document.getElementById("root") || document.createElement("div")
// );
