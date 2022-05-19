import Phaser from "phaser";
import Coin from "./coin";

export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;
  /** @type {Phaser.Physics.Arcade.Group} */
  coins;

  /** @type {Phaser.GameObjects.Text} */
  maticsCollectedText;

  maticsCollected = 0;
  currentCollisionCoin = "matic";
  playerName = localStorage.getItem("playerName");

  init() {
    this.maticsCollected = -1;
  }
  constructor() {
    super("game");
  }

  preload() {
    this.load.image("background", "/src/assets/bg_layer1.png");
    this.load.image("platform", "/src/assets/ground_grass.png");
    this.load.image("bunny-stand", "/src/assets/bunny1_stand.png");
    this.load.image("matic", "/src/assets/matic.png");
    this.load.image("eth", "/src/assets/eth.png");
  }

  create() {
    this.add.image(240, 320, "background").setScrollFactor(1, 0);
    // create the group
    this.platforms = this.physics.add.staticGroup();

    // then create 5 platforms from the group
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 600);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "platform");
      platform.scale = 0.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    // change to use class property this.player
    this.player = this.physics.add
      .sprite(240, 320, "bunny-stand")
      .setScale(0.5);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
    // same thing here in the second parameter
    this.physics.add.collider(this.platforms, this.player);
    // follow the rabbit with the camera
    this.cameras.main.startFollow(this.player);
    this.horizontalWrap(this.player);
    // set the horizontal dead zone to 1.5x game width
    this.cameras.main.setDeadzone(this.scale.width * 1.5);
    // moving left and right
    this.cursors = this.input.keyboard.createCursorKeys();

    // adding matics
    this.coins = this.physics.add.group({
      classType: Coin,
    });

    this.coins.get(240, 320, "matic");

    this.physics.add.collider(this.platforms, this.coins);

    // formatted this way to make it easier to read
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.handleCollectCoin, // called on overlap
      undefined,
      this
    );

    const style = { color: "#000", fontSize: 24 };
    this.maticsCollectedText = this.add
      .text(240, 10, `${this.playerName} has collected Matics: 0`, style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }
  handleGameOver() {
    localStorage.setItem("playerScore", this.maticsCollected);
    window.dispatchEvent(new Event("storage"));
    this.scene.start("game-over");
  }
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  handleCollectCoin(player, coin) {
    if (coin.texture.key === "eth") {
      this.handleGameOver();
    }
    console.log(coin);
    // hide from display
    this.coins.killAndHide(coin);

    // disable from physics world
    this.physics.world.disableBody(coin.body);

    this.maticsCollected++;
    // create new text value and set it
    const value = `${this.playerName}'s matics: ${this.maticsCollected}`;
    this.maticsCollectedText.text = value;
  }
  update() {
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
        console.log("update");
        // create a carrot above the platform being reused
        this.addCoinAbove(platform);
      }
    });
    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      // this makes the bunny jump straight up
      this.player.setVelocityY(-320);
    }

    // left and right input logic
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      // stop movement if not left or right
      this.player.setVelocityX(0);
    }

    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      this.handleGameOver();
    }
  }

  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; ++i) {
      const platform = platforms[i];

      // discard any platforms that are above current
      if (platform.y < bottomPlatform.y) {
        continue;
      }

      bottomPlatform = platform;
    }

    return bottomPlatform;
  }

  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCoinAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const coinType = this.getRandomInt(100) % 2 === 0 ? "matic" : "eth";
    const matic = this.coins.get(sprite.x, y, coinType);

    // set active and visible
    matic.setActive(true);
    matic.setVisible(true);

    this.add.existing(matic);

    matic.body.setSize(matic.width, matic.height);

    // make sure body is enabed in the physics world
    this.physics.world.enable(matic);

    return matic;
  }
}
