import Fruit from "../../models/entities/Fruits/index.js";
import Player from "../../models/entities/Player/index.js";

export default class Scene {
    constructor() {
        this.init();
    }

    configBackground(screenWidth = 640, screenHeight = 448, color = "brown"){
        this.background = new Image(`./assets/background/bg-${color}.png`);
        this.background.width = screenWidth;
        this.background.height = screenHeight;
    }

    init() {
        const { width, height } = Screen.getMode();
        this.configBackground(width, height)

        this.player = new Player(width, height);
        this.apple = new Fruit("Apple", width / 2, height - 32);
    }

    update() {
        this.background.draw(0, 0);
        this.player.handleInput();

        this.apple.update();
        this.apple.draw();

        if(this.player.isColliding(this.apple)){
            this.player.collectItem(this.apple)
        }

        this.player.update();
        this.player.draw();
    }
}
