import Fruit from "./models/Fruits/index.js";
import Player from "./models/Player/index.js";

const { width, height } = Screen.getMode();

const player = new Player(width, height);
const apple = new Fruit("Apple", width, height, width / 2, height / 2);

Screen.display(() => {
  player.handleInput();

  apple.updateAnimation();
  apple.draw();

  player.update();
  player.draw();
});