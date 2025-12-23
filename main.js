import InputManager from "./src/shared/input.js";
import MenuScreen from "./src/screens/MenuScreen.js";
import ScreenManager from "./src/modules/screenManager.js";
import { SCREENS } from "./src/shared/constants.js";
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

let lastFrameTime = Date.now();

Screen.display(() => {
    const now = Date.now();
    const deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    InputManager.update();
    screenManager.update(deltaTime);
    screenManager.render(deltaTime);
});