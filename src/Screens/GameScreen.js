import Player from "../models/Player.js";
import BaseScreen from "./BaseScreen.js";

export default class GameScreen extends BaseScreen {
    constructor() {
        super();
        // this.levelManager = new LevelManager();

        this.player = new Player();
    }

    async _registerLevels() {
        // this.levelManager
        //     .registerLevel("level1", level1Config, true)
        //     .registerLevel("level2", level2Config);
    }

    async onEnter() {
        // if (!this.levelManager.getCurrentLevel()) {
        //     this._registerLevels();
        //     // this.levelManager.initialize();
        // } else {
        //     this.levelManager.resume();
        // }
    }

    onExit() {
        // this.levelManager.cleanup();
    }

    render() {
        super.renderBackground();

        // const level = this.levelManager.getCurrentLevel();
        // if (level) {
        //     const deltaTime = 16.67;
        //     level.update(deltaTime);
        // }

        this.player.update(16.67);
    }
}