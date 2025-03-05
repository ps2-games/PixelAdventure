import Game from "./src/core/Game/index.js";
import Scene from "./src/core/Scene/index.js";

const scene = new Scene();
const game = new Game(scene);
game.start();
