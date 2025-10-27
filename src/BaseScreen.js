import { parallaxToDown } from "./animationEngine.js";
import Assets from "./assets.js";
import { ASSETS_PATH, SCREEN_HEIGHT } from "./constants.js";

const BACKGROUNDS = [
    `${ASSETS_PATH.Backgrounds}/blue.png`,
    `${ASSETS_PATH.Backgrounds}/brown.png`,
    `${ASSETS_PATH.Backgrounds}/gray.png`,
    `${ASSETS_PATH.Backgrounds}/green.png`,
    `${ASSETS_PATH.Backgrounds}/pink.png`,
    `${ASSETS_PATH.Backgrounds}/purple.png`,
    `${ASSETS_PATH.Backgrounds}/yellow.png`,
]

export default class BaseScreen {
    constructor() {
        this.background = Assets.image(this._randomBackground());
        this.parallaxState = {
            backgroundsY: [0, SCREEN_HEIGHT],
            screenHeight: SCREEN_HEIGHT
        }

        this.screenManager = null;
    }


    _randomBackground(min = 0, max = BACKGROUNDS.length) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return BACKGROUNDS[Math.floor(Math.random() * (max - min) + min)];
    }

    renderBackground() {
        parallaxToDown(this.background, this.parallaxState, 24)
    }

    setScreenManager(manager) {
        this.screenManager = manager;
    }

    onEnter() { }

    onExit() { }

    render() { }
}