import Player from "../modules/player/player.js";
import BaseScreen from "./baseScreen.js";

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
    
        if(this.player) {
            this.player.update();
            
            if(this.player.shouldRemove()) {
                this.player.destroy();
                this.player = null;
            }
        }
    }
}