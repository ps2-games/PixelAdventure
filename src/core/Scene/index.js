import Player from "../../models/entities/Player/index.js";
import FruitManager from "../../models/managers/Fruit/index.js";
import TileMapRender from "../../models/renders/TileMap/index.js";
import backgroundConfigLevel1 from "../levels/level1/constants/backgroud.js";
import fruitsLevel1 from "../levels/level1/constants/fruits.js";

export default class Scene {
    constructor() {
        this.backgroundImage = new Image('./assets/background/defaultBg.png')

        this.background = {
            tiles: backgroundConfigLevel1.tileMap,
            image: new Image(`./assets/background/${backgroundConfigLevel1.color}.png`),
            speed: backgroundConfigLevel1.speed,
            offsetY: 0
        };

        this.init();
    }


    init() {
        const { width, height } = Screen.getMode();
        this.player = new Player(width, height, { initialX: width / 2, initialY: height / 2 });
        this.fruitManager = new FruitManager(this.player);
        this.tileMapRender = new TileMapRender();

        this.tileMapRender.createTileMap();
        fruitsLevel1.forEach((fruit) => this.fruitManager.addFruit(fruit.type, fruit.x, fruit.y))

    }

    drawBackgroundTile() {
        for (const { tileX, tileY } of backgroundConfigLevel1.tileMap) {
            this.background.image.draw(tileX, tileY);
        }
    }

    update() {
        this.backgroundImage.draw(0, 0);
        this.drawBackgroundTile();
        this.tileMapRender.render();

        this.fruitManager.update();

        this.player.handleInput();
        this.player.update();
        this.player.draw();
    }
}
