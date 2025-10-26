import LevelManager from "./LevelManager.js";
import level1Config from "./levels/level1/main.js";
import level2Config from "./levels/level2/main.js";
import BaseScreen from "./BaseScreen.js";

export default class GameScreen extends BaseScreen {
    constructor() {
        super();
        this.levelManager = new LevelManager();
    }

    async _registerLevels() {
        this.levelManager
            .registerLevel("level1", level1Config, true)
            .registerLevel("level2", level2Config);
    }

    async onEnter() {
        if (!this.levelManager.getCurrentLevel()) {
            this._registerLevels();
            this.levelManager.initialize();
        } else {
            this.levelManager.resume();
        }
    }

    onExit() {
        this.levelManager.cleanup();
    }

    render() {
        super.renderBackground();

        const level = this.levelManager.getCurrentLevel();
        if (level) {
            const deltaTime = 16.67;
            level.update(deltaTime);
        }
    }
}