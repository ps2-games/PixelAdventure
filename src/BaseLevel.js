import FruitManager from "./FruitManager.js";
import Player from "./Player.js";
import TrapManager from "./TrapManager.js";
import TileMapRender from "./TileMapRender.js";

export default class BaseLevel {
    constructor(config) {
        this.config = config;
        // this.backgroundImage = new Image('./assets/background/defaultBg.png');
        this.initialPlayerPosition = config.initialPlayerPosition;
        this.tileMapConfig = config.tileMapConfig;
        this.fruits = config.fruits;
        this.traps = config.traps;
        this.isInitialized = false;
        this.levelManager = null;

        // this.background = {
        //     tiles: config.backgroundConfig?.tileMap || null,
        //     image: config.backgroundConfig ? new Image(`./assets/background/${config.backgroundConfig.color}.png`) : null,
        //     speed: config.backgroundConfig?.speed || 0,
        //     offsetY: 0,
        //     limitY: config.backgroundConfig?.limitY || 0,
        //     resetY: config.backgroundConfig?.resetY || 0,
        //     blanketMap: config.backgroundConfig?.blanketMap || null
        // };

        this.init();
    }

    setLevelManager(manager) {
        this.levelManager = manager;
    }

    init() {
        // if (this.background.blanketMap) {
        //     this.blanketTileMap = new TileMapRender(this.background.blanketMap);
        // }

        if (this.tileMapConfig) {
            this.tileMapRender = new TileMapRender(this.tileMapConfig);

            if (this.initialPlayerPosition) {
                this.player = new Player({
                    initialX: this.initialPlayerPosition.x,
                    initialY: this.initialPlayerPosition.y,
                    tileMap: this.tileMapRender.collisionTiles,
                });

                this.fruitManager = new FruitManager(this.player);
                this.trapManager = new TrapManager(this.player);

                if (this.fruits) {
                    this.fruits.forEach((fruit) =>
                        this.fruitManager.addFruit(fruit.type, fruit.x, fruit.y)
                    );
                }

                if (this.traps) {
                    this.traps.forEach((trap) =>
                        this.trapManager.addTrap(trap.type, trap.x, trap.y, trap.options)
                    );
                }

                this.isInitialized = true;
            }
        }
    }

    // drawBackgroundTile() {
    //     if (this.background.tiles && this.background.image) {
    //         this.background.offsetY -= this.background.speed;

    //         for (const tile of this.background.tiles) {
    //             let yPos = tile.tileY + this.background.offsetY;

    //             if (yPos < this.background.limitY) {
    //                 const overflow = this.background.limitY - yPos;
    //                 yPos = this.background.resetY - overflow;
    //                 tile.tileY = yPos - this.background.offsetY;
    //             }

    //             this.background.image.draw(tile.tileX, yPos);
    //         }
    //     }
    // }

    update(deltaTime = 16.67) {
        // this.backgroundImage.draw(0, 0);
        // this.drawBackgroundTile();

        if (!this.isInitialized) {
            return;
        }

        if (this.fruitManager) this.fruitManager.update(deltaTime);
        if (this.trapManager) this.trapManager.update(deltaTime);
        if (this.tileMapRender) this.tileMapRender.render();

        if (this.player && this.player.shouldRemove()) {
            this.player = null;
        }

        // if (this.blanketTileMap) {
        //     this.blanketTileMap.render();
        // }

        if (this.player) {
            this.player.update(deltaTime);
        }
    }

    allFruitsCollected() {
        return this.fruitManager && this.fruitManager.fruits.length === 0;
    }

    isPlayerAlive() {
        return !!this.player && !this.player.shouldRemove();
    }

    // Lifecycle hooks
    onEnter() {
        // Override em scenes customizadas
    }

    onExit() {
        // Override em scenes customizadas
    }

    onPause() {
        // Override em scenes customizadas
    }

    onResume() {
        // Override em scenes customizadas
    }

    cleanup() {
        this.player = null;
        this.fruitManager = null;
        this.trapManager = null;
        this.tileMapRender = null;
        this.blanketTileMap = null;
    }
}