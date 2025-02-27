import Fruit from "./models/entities/Fruits/index.js";
import Player from "./models/entities/Player/index.js";

class Main {
  constructor() {
    const { width, height } = Screen.getMode();

    this.player = new Player(width, height);
    this.apple = new Fruit("Apple", width / 2, height / 2);
  }

  run(){
    this.player.handleInput();

    this.apple.updateAnimation();
    this.apple.draw();
  
    this.player.update();
    this.player.draw();
  }
}

const main = new Main()

Screen.display(() => {
  main.run()
});
