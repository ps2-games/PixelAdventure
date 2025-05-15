import LevelManager from "../LevelManager/index.js";
import { drawBackgroundTile } from "./background/index.js";

export default class Game {
  constructor() {
    this.scene = null;
    this.levelManager = new LevelManager(this);
    this.timer = Timer.new();
    this.lastTime = 0;
    this.timeStep = 1000 / 60;
    this.running = false;
    this.currentScene = 0;

    this.playButton = new Image("./assets/ui/buttons/Play.png");
    this.playButton.width = 42;
    this.playButton.height = 44;

    this.logo = new Image("./assets/ui/logo.png");
    this.logo.width = 437.6;
    this.logo.height = 137.5;

    this.pads = Pads.get();
    this.screenSize = Screen.getMode();
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
        this.playButton.draw(
          this.screenSize.width / 2 - this.playButton.width / 2,
          this.screenSize.height / 1.5
        );
        this.logo.draw(
          this.screenSize.width / 2 - this.logo.width / 2,
          80
        );

        if (this.pads.pressed(Pads.CROSS)) {
          this.currentScene = 1;
          this.levelManager.switchLevel("level1");
        }
        break;
      default:
        if (this.scene) {
          this.scene.update(deltaTime / 16.67);
          if (this.shouldSwitchLevel()) {
            this.levelManager.nextLevel();
          }
        }
        break;
    }
  }

  shouldSwitchLevel() {
    if (this.scene && this.scene.fruitManager && this.scene.fruitManager.allFruitsCollected()) {
      return true;
    }
    return false;
  }
}