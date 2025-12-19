import InputManager from "./src/shared/input.js";
import MenuScreen from "./src/screens/MenuScreen.js";
import ScreenManager from "./src/modules/screenManager.js";
import { SCREENS } from "./src/shared/constants.js";
import GameScreen from "./src/screens/gameScreen.js";
import TilemapRenderer from "./src/modules/tilemap/renderer.js";

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

const file = std.open("data.json", "r");
const jsonString = file.readAsString();

file.close();

const mapData = JSON.parse(jsonString);

const tileRender = new TilemapRenderer(mapData.tiles);

Screen.display(() => {
    //InputManager.update();

    //screenManager.update();
    //screenManager.render();
    tileRender.draw(0, 0);
});