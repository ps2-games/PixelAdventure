import Player from "../../models/entities/Player/index.js";
import FruitManager from "../../models/managers/Fruit/index.js";
import TileMapRender from "../../models/renders/TileMap/index.js";

export default class Scene {
    constructor({ backgroundConfig, tileMapConfig, fruits, traps, initialPlayerPosition }) {
        this.backgroundImage = new Image('./assets/background/defaultBg.png')
        this.initialPlayerPosition = initialPlayerPosition;
        this.tileMapConfig = tileMapConfig;
        this.fruits = fruits;
        this.traps = traps;

        this.background = {
            tiles: backgroundConfig ? backgroundConfig.tileMap : null,
            image: backgroundConfig ? new Image(`./assets/background/${backgroundConfig.color}.png`) : null,
            speed: backgroundConfig ? backgroundConfig.speed : 0,
            offsetY: 0,
            limitY: backgroundConfig ? backgroundConfig.limitY : 0,
            resetY: backgroundConfig ? backgroundConfig.resetY : 0,
            blanketMap: backgroundConfig ? backgroundConfig.blanketMap : null
        };

        this.init();
    }


    init() {
        const { width, height } = Screen.getMode();

        if (this.background.blanketMap) {
            this.blanketTileMap = new TileMapRender(this.background.blanketMap);
        }

        if (this.tileMapConfig) {
            this.tileMapRender = new TileMapRender(this.tileMapConfig);
            this.player = new Player(width, height, { initialX: this.initialPlayerPosition.x, initialY: this.initialPlayerPosition.y, tileMap: this.tileMapRender.tileMap });
            this.fruitManager = new FruitManager(this.player);
        }

        if (this.fruits) {
            this.fruits.forEach((fruit) => this.fruitManager.addFruit(fruit.type, fruit.x, fruit.y))
        }

    }

    drawBackgroundTile() {
        if (this.background.tiles && this.background.image) {
            this.background.offsetY -= this.background.speed;

            for (const tile of this.background.tiles) {
                let yPos = tile.tileY + this.background.offsetY;

                if (yPos < this.background.limitY) {
                    const overflow = this.background.limitY - yPos;
                    yPos = this.background.resetY - overflow;
                    tile.tileY = yPos - this.background.offsetY;
                }

                this.background.image.draw(tile.tileX, yPos);
            }
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
        this.blanketTileMap.render();
    }
}
