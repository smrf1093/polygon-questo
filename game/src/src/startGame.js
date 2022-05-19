import Phaser from "phaser";

export default class StartGame extends Phaser.Scene {
  constructor() {
    super("start-game");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x4488aa);
    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(width * 0.5, height * 0.5, "Welcome Coin Collectors (Hit space)", {
        fontSize: 36,
      })
      .setOrigin(0.5);
    this.input.keyboard.on("keydown-SPACE", () => {
      if (localStorage.getItem("isWalletConnected") != "true" || localStorage.getItem("playerName") == "" || localStorage.getItem("playerName") == null) {
        alert("Please connect your wallet and pick a name");
      } else {
        this.scene.start("game");
      }
      // var player = prompt("Please enter your name", "name");
      // localStorage.setItem("playerName", player);
    });
  }
  update() {}
}
