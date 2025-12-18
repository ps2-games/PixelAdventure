import { ASSETS_PATH, TILE_SIZE, TILES_PER_COLUMN, TILES_PER_ROW } from "../../shared/constants.js";

export default class TilemapRenderer {
    constructor() {
        this.spacing = 8;

        this.spriteDefs = [];
        for (let y = 0; y < TILES_PER_COLUMN; y++) {
            for (let x = 0; x < TILES_PER_ROW; x++) {
                const atlasX = x * TILE_SIZE;
                const atlasY = y * TILE_SIZE;
                
                this.spriteDefs.push({
                    x: x * (TILE_SIZE + this.spacing),
                    y: y * (TILE_SIZE + this.spacing),
                    w: TILE_SIZE,
                    h: TILE_SIZE,
                    zindex: 1,
                    u1: atlasX,
                    v1: atlasY,
                    u2: atlasX + 16,
                    v2: atlasY + 16,
                    r: 128,
                    g: 128,
                    b: 128,
                    a: 128,
                });
            }
        }

        this.descriptor = new TileMap.Descriptor({
            textures: [ASSETS_PATH.TileSet],
            materials: [{
                texture_index: 0,
                blend_mode: Screen.alphaEquation(Screen.ONE_RGB, Screen.ZERO_RGB, Screen.ONE_RGB, Screen.ZERO_RGB, 0),
                end_offset: this.spriteDefs.length - 1,
            }],
        });


        this.spriteBuffer = TileMap.SpriteBuffer.fromObjects(this.spriteDefs);
        this.tileMap = new TileMap.Instance({ descriptor: this.descriptor, spriteBuffer: this.spriteBuffer });

        TileMap.init();
    }

    draw(x, y){
        TileMap.begin();

        this.tileMap.render(x, y);
    }
}