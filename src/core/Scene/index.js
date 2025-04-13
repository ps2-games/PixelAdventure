import Fruit from "../../models/entities/Fruits/index.js";
import Player from "../../models/entities/Player/index.js";

export default class Scene {
    constructor() {
        this.fruits = [];
        this.configAudio = Sound.load('./assets/sounds/pickup_fruit.adp');
        this.fruitSlot = 0;
        this.fruitSlotSize = 4;

        this.backgrounds = [];
        this.bgY = [0, 0];
        this.bgSpeed = 0.75;

        this.init();
    }

    configBackground(screenWidth = 640, screenHeight = 448, color = "brown") {
        const bg1 = new Image(`./assets/background/bg-${color}.png`);
        const bg2 = new Image(`./assets/background/bg-${color}.png`);

        bg1.width = screenWidth;
        bg1.height = screenHeight;

        bg2.width = screenWidth;
        bg2.height = screenHeight;

        this.backgrounds = [bg1, bg2];
        this.bgY = [0, screenHeight];
    }

    drawParallaxBackground() {
        const screenHeight = this.backgrounds[0].height;

        for (let i = 0; i < this.bgY.length; i++) {
            this.bgY[i] -= this.bgSpeed;

            if (this.bgY[i] <= -screenHeight) {
                this.bgY[i] = screenHeight + (this.bgY[i] + screenHeight);
            }
        }

        for (let i = 0; i < this.backgrounds.length; i++) {
            this.backgrounds[i].draw(0, this.bgY[i]);
        }
    }

    init() {
        const { width, height } = Screen.getMode();
        this.configBackground(width, height);

        this.player = new Player(width, height);

        this.addFruit("Apple", width / 2, height - 32, this.configAudio);
        this.addFruit("Bananas", (width / 2) - 32, height - 32, this.configAudio);
        this.addFruit("Pineapple", (width / 2) - 64, height - 32, this.configAudio);
        this.addFruit("Strawberry", (width / 2) - 96, height - 32, this.configAudio);
        this.addFruit("Cherries", (width / 2) - 128, height - 32, this.configAudio);
        this.addFruit("Kiwi", (width / 2) - 160, height - 32, this.configAudio);
        this.addFruit("Melon", (width / 2) - 192, height - 32, this.configAudio);
        this.addFruit("Orange", (width / 2) - 224, height - 32, this.configAudio);
    }

    addFruit(type, x, y, sound) {
        const fruit = new Fruit(type, x, y, sound);
        this.fruits.push(fruit);
    }

    update() {
        this.drawParallaxBackground();

        this.player.handleInput();

        this.fruits.forEach(fruit => {
            fruit.update(this.player, this);
            fruit.draw();
        });

        this.fruits = this.fruits.filter(fruit => !fruit.shouldRemove());

        this.player.update();
        this.player.draw();
    }
}
