// import { SCREENS } from "./src/constants.js";
// import GameScreen from "./src/Screens/GameScreen.js";
import { DELTA_TIME } from "./src/constants.js";
import InputManager from "./src/input.js";
// import MenuScreen from "./src/Screens/MenuScreen.js";
// import ScreenManager from "./src/Managers/ScreenManager.js";
import Player from "./src/models/Player.js";

// const screenManager = new ScreenManager();

// screenManager
//     .registerScreens([
//         { id: SCREENS.MENU, class: MenuScreen, default: true },
//         { id: SCREENS.GAME, class: GameScreen }
//     ])
//     .setTransitionSpeed(0.0083)
//     .initialize();


let player = new Player();

Screen.setFrameCounter(true);
Screen.setVSync(false);
Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);

Screen.display(() => {
    InputManager.update();

    // screenManager.update();
    // screenManager.render();

    if (player && player.shouldRemove()) {
        player = null;
    }

    if (player) {
        player.update(DELTA_TIME);
    }
});