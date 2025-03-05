import TileMap from "../../models/components/TileMap/index.js";
import TileSet from "../../models/components/TileSet/index.js";
import Fruit from "../../models/entities/Fruits/index.js";
import Player from "../../models/entities/Player/index.js";

export default class Scene {
    constructor() {
        this.init();
    }

    init() {
        const { width, height } = Screen.getMode();

        const tilesetImage = new Image("./src/assets/tileset/Terrain16x16.png", VRAM);
        const commonTileSet = new TileSet({
            key: "terrain",
            image: tilesetImage,
            tileSize: 16,
        });

        this.tileMap = new TileMap({
            x: 0,
            y: 0,
            width,
            height,
            chunkSize: 16,
            chunkHysteresis: 2,
            chunkUnloadDelay: 5000,
            tilesets: [commonTileSet],
            layers: [
                [
                    [6, 7, 7, 7, 8],
                    [6, 0, 0, 0, 8],
                    [6, 0, 7, 0, 8],
                    [6, 7, 7, 7, 8]
                ]
            ],
        });

        this.player = new Player(width, height);
        this.apple = new Fruit("Apple", width / 2, height / 2);
    }

    update() {
        this.player.handleInput();

        this.tileMap.update(this.player._x, this.player._y);
        this.tileMap.renderViewport();

        this.apple.updateAnimation();
        this.apple.draw();

        this.player.update();
        this.player.draw();
    }
}
