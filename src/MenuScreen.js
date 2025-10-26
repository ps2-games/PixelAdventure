import Assets from "./assets.js";
import { ASSETS_PATH, BUTTONS, SCREEN_HEIGHT, SCREEN_WIDTH, SCREENS } from "./constants.js";
import InputManager from "./InputManager.js";
import BaseScreen from "./BaseScreen.js";

export default class MenuScreen extends BaseScreen {
    constructor() {
        super();

        this.playButton = Assets.image(`${ASSETS_PATH.UI}/buttons/Play.png`)
        this.playButton.width = 42;
        this.playButton.height = 44;

        this.logo = Assets.image(`${ASSETS_PATH.UI}/logo.png`);
        this.logo.width = 437.6;
        this.logo.height = 137.5;

    }

    render() {
        this.renderBackground();

        this.playButton.draw(SCREEN_WIDTH / 2 - this.playButton.width / 2, SCREEN_HEIGHT / 1.5);
        this.logo.draw(SCREEN_WIDTH / 2 - this.logo.width / 2, 80);


        if (InputManager.player(0).justPressed(BUTTONS.CROSS)) {
            this.screenManager.changeScreen(SCREENS.GAME, true)
        }
    }

}