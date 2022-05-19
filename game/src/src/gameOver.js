import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x4488aa);
    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(width * 0.5, height * 0.5, "Game Over (Hit space to start again)", {
        fontSize: 36,
      })
      .setOrigin(0.5);

    this.add
      .text(
        width * 0.5,
        height * 0.7,
        `Your score: ${localStorage.getItem("playerScore")}`,
        {
          fontSize: 36,
        }
      )
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("start-game");
    });
  }
}
