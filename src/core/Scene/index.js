import Fruit from "../../models/entities/Fruits/index.js";
import Player from "../../models/entities/Player/index.js";
import { backgroundTileMapLevel1 } from "../levels/level1/constants/backgroud.js";
import { mapLevel1 } from "../levels/level1/constants/map.js";
import { TILE_SIZE, BACKGROUND_SIZE } from "./constants/index.js";

export default class Scene {
    constructor() {
        this.fruits = [];
        this.fruitSlot = 0;
        this.fruitSlotSize = 4;

        this.configAudio = Sound.load('./assets/sounds/pickup_fruit.adp');
        this.tilesetImage = new Image('./assets/tileset/Terrain16x16.png');
        this.backgroundImage = new Image('./assets/background/defaultBg.png')
        this.backgroundTile = new Image('./assets/background/Brown.png');
        this.backgroundTileSize = BACKGROUND_SIZE;
        this.tilesetImage.width = TILE_SIZE;
        this.tilesetImage.height = TILE_SIZE;

        this.init();
    }

    init() {
        const { width, height } = Screen.getMode();
        this.player = new Player(width, height);
        const fruitNames = [
            "Apple", "Bananas", "Pineapple", "Strawberry",
            "Cherries", "Kiwi", "Melon", "Orange"
        ];

        fruitNames.forEach((name, index) => {
            const x = (width / 2) - (index * 32);
            const y = height - 32;
            this.addFruit(name, x, y, this.configAudio);
        });
    }

    drawBackgroundTile(){
        for (const { tileX, tileY } of backgroundTileMapLevel1) {
            this.backgroundTile.draw(tileX, tileY);
        }
    }

    drawTiles() {
        for (const { tileColumn, tileRow, tileX, tileY } of mapLevel1) {
            const startX = tileColumn * TILE_SIZE;
            const startY = tileRow * TILE_SIZE;
            const endX = startX + TILE_SIZE;
            const endY = startY + TILE_SIZE;

            Object.assign(this.tilesetImage, {
                startx: startX,
                starty: startY,
                endx: endX,
                endy: endY,
                width: TILE_SIZE,
                height: TILE_SIZE
            });

            this.tilesetImage.draw(tileX, tileY);
        }
    }

    addFruit(type, x, y, sound) {
        const fruit = new Fruit(type, x, y, sound);
        this.fruits.push(fruit);
    }

    update() {
        this.backgroundImage.draw(0, 0)
        this.drawBackgroundTile()
        this.drawTiles();
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
