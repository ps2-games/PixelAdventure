import level1Config from "../levels/level1/main.js";
import level2Config from "../levels/level2/main.js";
import { BACKGROUND_SIZE } from "../Scene/constants/index.js";
import Scene from '../Scene/index.js'

const { width, height } = Screen.getMode()

const defaultBackground = {
  tiles: Array.from({ length: 10 }, (_, col) => {
    return Array.from({ length: 9 }, (_, row) => ({
      tileX: col * BACKGROUND_SIZE,
      tileY: row * BACKGROUND_SIZE,
      rowIndex: row
    }));
  }).flat(),
  image: new Image(`./assets/background/Yellow.png`),
  speed: 0.05,
  offsetY: 0,
  limitY: -64,
  resetY: 512,
  blanketMap: null
};

function drawBackgroundTile() {
  if (defaultBackground.tiles && defaultBackground.image) {
    defaultBackground.offsetY -= defaultBackground.speed;

    for (const tile of defaultBackground.tiles) {
      let yPos = tile.tileY + defaultBackground.offsetY;

      if (yPos < defaultBackground.limitY) {
        const overflow = defaultBackground.limitY - yPos;
        yPos = defaultBackground.resetY - overflow;
        tile.tileY = yPos - defaultBackground.offsetY;
      }

      defaultBackground.image.draw(tile.tileX, yPos);
    }
  }
};

export default class Game {
  constructor() {
    this.scene = null;
    this.timer = Timer.new();
    this.lastTime = 0;
    this.timeStep = 1000 / 60;
    this.running = false;

    this.currentScene = 0

    this.playButton = new Image('./assets/ui/buttons/Play.png');
    this.playButton.width = 42
    this.playButton.height = 44

    this.logo = new Image('./assets/ui/logo.png')
    this.logo.width = 437.6
    this.logo.height = 137.5

    this.pads = Pads.get();
  }

  start() {
    Screen.setFrameCounter(true);
    Screen.setVSync(false);
    this.running = true;
    Timer.reset(this.timer);
    this.lastTime = Timer.getTime(this.timer);
    Screen.display(() => this.gameLoop());
  }

  stop() {
    this.running = false;
    Timer.destroy(this.timer);
  }

  gameLoop() {
    if (!this.running) return;
    this.renderScene();
  }

  renderScene() {
    const currentTime = Timer.getTime(this.timer);
    let deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    switch (this.currentScene) {
      case 0:
        this.pads.update();
        drawBackgroundTile();
        this.playButton.draw(width / 2 - this.playButton.width / 2, height / 1.5)
        this.logo.draw(width / 2 - this.logo.width / 2, 80);

        if (this.pads.pressed(Pads.CROSS)) this.currentScene = 1;

        break;
      case 1:
        if (!this.scene) this.scene = new Scene(level1Config)
        this.scene.update(deltaTime / 16.67);
        break;
      case 2:
        if (!this.scene) this.scene = new Scene(level2Config)
        this.scene.update(deltaTime / 16.67);
        break;
    }
  }
}