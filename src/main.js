import { Fruit } from "./models/Fruits/index.js";
import { Player } from "./models/Player/index.js";

const { width, height } = Screen.getMode();
const PADS = Pads.get();

const player = new Player(width, height);
const apple = new Fruit("Apple", width, height)

Screen.display(() => {
  PADS.update();

  if (PADS.pressed(Pads.RIGHT)) {
    player.moveRight();
  } else if (PADS.pressed(Pads.LEFT)) {
    player.moveLeft();
  } else {
    player.setAnimation('IDLE');
  }

  if (PADS.pressed(Pads.UP)) {
    player.jump();
  }

  apple.updateAnimation();
  apple.draw();

  player.update();
  player.draw();
});