import InputManager from "./src/input.js";
import MenuScreen from "./src/Screens/MenuScreen.js";
import ScreenManager from "./src/Managers/ScreenManager.js";
import { SCREENS } from "./src/constants.js";
import GameScreen from "./src/Screens/GameScreen.js";

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