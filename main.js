import { SCREENS } from "./src/constants.js";
import GameScreen from "./src/GameScreen.js";
import InputManager from "./src/InputManager.js";
import MenuScreen from "./src/MenuScreen.js";
import ScreenManager from "./src/ScreenManager.js";

const screenManager = new ScreenManager();

screenManager
    .registerScreens([
        { id: SCREENS.MENU, class: MenuScreen, default: true },
        { id: SCREENS.GAME, class: GameScreen }
    ])
    .setTransitionSpeed(0.0083)
    .initialize();

Screen.setFrameCounter(true);
Screen.setVSync(false);
Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);

Screen.display(() => {
    InputManager.update();

    screenManager.update();
    screenManager.render();
});