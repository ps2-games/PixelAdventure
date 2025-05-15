import Game from './src/core/Game/index.js'
import level1Config from './src/core/levels/level1/main.js';
import level2Config from './src/core/levels/level2/main.js';
import Scene from './src/core/Scene/index.js'

const initialScene = new Scene(level1Config);
const game = new Game(initialScene);

game.levelManager.addLevel("level1", level1Config);
game.levelManager.addLevel("level2", level2Config);

game.levelManager.switchLevel("level1");


game.start();