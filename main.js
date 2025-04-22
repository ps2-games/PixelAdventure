import Game from "./src/core/Game/index.js";
import level1Config from "./src/core/levels/level1/main.js";
import level2Config from "./src/core/levels/level2/main.js";
import Scene from "./src/core/Scene/index.js";

const scene = new Scene(level2Config);
const game = new Game(scene);
game.start();
