import InputManager from "./src/InputManager.js";
import Player from "./src/PlayerV2.js";

let player = new Player();


Screen.setFrameCounter(true);
Screen.setVSync(false);
Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);

const deltaTime = 16.67 / 1000;
Screen.display(() => {
    InputManager.update();

    if (player && player.shouldRemove()) player = null;

    if (player) player.update(deltaTime);
});