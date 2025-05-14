import Player from "../../models/entities/Player/index.js";
import TileMapRender from "../../models/renders/TileMap/index.js";
import FruitManager from "../../models/managers/fruit/index.js";
import TrapManager from "../../models/managers/trap/index.js";

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
        if (this.background.blanketMap) {
            this.blanketTileMap = new TileMapRender(this.background.blanketMap);
        }

        if (this.tileMapConfig) {
            this.tileMapRender = new TileMapRender(this.tileMapConfig);
            this.trapManager = new TrapManager(null, this.tileMapRender.collisionTiles);

            this.player = new Player({
                initialX: this.initialPlayerPosition.x,
                initialY: this.initialPlayerPosition.y,
                tileMap: this.tileMapRender.collisionTiles,
                traps: this.trapManager.traps
            });

            this.fruitManager = new FruitManager(this.player);
            this.trapManager.setPlayer(this.player);
        }

        if (this.fruits) {
            this.fruits.forEach((fruit) => this.fruitManager.addFruit(fruit.type, fruit.x, fruit.y))
        }

        if (this.traps) {
            this.traps.forEach((trap) => this.trapManager.addTrap(trap.type, trap.x, trap.y, trap.options))
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

    update(deltaTime = 16.67) {
        this.backgroundImage.draw(0, 0);
        this.drawBackgroundTile();

        this.fruitManager.update(deltaTime);
        this.trapManager.update(deltaTime);
        this.tileMapRender.render();

        if (this.player && this.player.shouldRemove()) {
            this.player = null;
        }

        if (this.blanketTileMap) {
            this.blanketTileMap.render();
        }

        if (this.player) {
            this.player.update(deltaTime);
        }
    }
}
