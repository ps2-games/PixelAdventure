import Fruit from "../../models/entities/Fruits/index.js";
import Player from "../../models/entities/Player/index.js";

export default class Scene {
    constructor() {
        this.fruits = []
        this.init();
    }

    configBackground(screenWidth = 640, screenHeight = 448, color = "brown") {
        this.background = new Image(`./assets/background/bg-${color}.png`);
        this.background.width = screenWidth;
        this.background.height = screenHeight;
    }

    init() {
        const { width, height } = Screen.getMode();
        this.configBackground(width, height)

        this.player = new Player(width, height);

        this.addFruit("Apple", width / 2, height - 32);
        this.addFruit("Apple", (width / 2) - 32, height - 32);
        this.addFruit("Apple", (width / 2) - 64, height - 32);
        this.addFruit("Apple", (width / 2) - 96, height - 32);
    }

    addFruit(type, x, y) {
        const fruit = new Fruit(type, x, y)

        this.fruits.push(fruit)
    }

    update() {
        this.background.draw(0, 0);
        this.player.handleInput();
    
        this.fruits.forEach(fruit => {
          fruit.update(this.player);
          fruit.draw();
        });
    
        this.fruits = this.fruits.filter(fruit => !fruit.shouldRemove());

        this.player.update();
        this.player.draw();
      }
}
