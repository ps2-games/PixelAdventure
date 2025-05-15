import level1Config from "../levels/level1/main.js";
import level2Config from "../levels/level2/main.js";
import { BACKGROUND_SIZE } from "../Scene/constants/index.js";
import Scene from '../Scene/index.js';
import SceneManager from '../SceneManager/index.js';

const { width, height } = Screen.getMode();

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
}

export default class Game {
  constructor() {
    this.sceneManager = new SceneManager();
    this.timer = Timer.new();
    this.lastTime = 0;
    this.timeStep = 1000 / 60;
    this.running = false;
    this.activeScene = null;
    this.levelComplete = false;

    this.playButton = new Image('./assets/ui/buttons/Play.png');
    this.playButton.width = 42;
    this.playButton.height = 44;

    this.logo = new Image('./assets/ui/logo.png');
    this.logo.width = 437.6;
    this.logo.height = 137.5;

    this.pads = Pads.get();

    this.initScenes();
  }

  initScenes() {
    this.sceneManager.addScene('menu', null);
    this.sceneManager.addScene('level1', level1Config);
    this.sceneManager.addScene('level2', level2Config);
    this.sceneManager.switchScene('level2');
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

  loadScene(sceneName) {
    const sceneConfig = this.sceneManager.switchScene(sceneName);
    if (sceneConfig) {
      this.activeScene = null;
      this.activeScene = new Scene(sceneConfig);
      this.levelComplete = false;
    }
    return sceneConfig;
  }

  checkLevelCompletion() {
    if (this.activeScene && this.activeScene.fruitManager) {
      const allFruitsCollected = this.activeScene.fruitManager.fruits.length === 0;
      return allFruitsCollected;
    }
    return false;
  }

  renderScene() {
    const currentTime = Timer.getTime(this.timer);
    let deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.pads.update();

    if (this.sceneManager.currentScene === 'menu') {
      drawBackgroundTile();
      this.playButton.draw(width / 2 - this.playButton.width / 2, height / 1.5);
      this.logo.draw(width / 2 - this.logo.width / 2, 80);

      if (this.pads.pressed(Pads.CROSS)) {
        this.loadScene('level1');
      }
    } else {
      if (!this.activeScene) {
        const currentSceneConfig = this.sceneManager.getCurrentScene();
        if (currentSceneConfig) {
          this.activeScene = new Scene(currentSceneConfig);
        }
      }

      if (this.activeScene) {
        this.activeScene.update(deltaTime / 16.67);

        this.levelComplete = this.checkLevelCompletion();

        if (this.levelComplete && this.sceneManager.currentScene === 'level1') {
          this.loadScene('level2');
        }
      }
    }
  }
}