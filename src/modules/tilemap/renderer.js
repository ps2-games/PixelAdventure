import { ASSETS_PATH, TILE_SIZE, TILES_PER_ROW } from "../../shared/constants.js";

export default class TilemapRenderer {
    constructor(mapdata) {

        this.spriteDefs = [];
        
        for (let i = 0; i < mapdata.length; i++) {
            const tileIndex = mapdata[i][0];

            const atlasCol = tileIndex % TILES_PER_ROW;
            const atlasRow = Math.floor(tileIndex / TILES_PER_ROW);

            const atlasX = atlasCol * TILE_SIZE;
            const atlasY = atlasRow * TILE_SIZE;

            this.spriteDefs.push({
                x: mapdata[i][1],
                y: mapdata[i][2],
                w: TILE_SIZE,
                h: TILE_SIZE,
                zindex: 1,
                u1: atlasX,
                v1: atlasY,
                u2: atlasX + TILE_SIZE,
                v2: atlasY + TILE_SIZE,
                r: 128,
                g: 128,
                b: 128,
                a: 128,
            });
        }

        this.descriptor = new TileMap.Descriptor({
            textures: [ASSETS_PATH.TileSet],
            materials: [{
                texture_index: 0,
                blend_mode: Screen.alphaEquation(
                    Screen.SRC_RGB,
                    Screen.DST_RGB,
                    Screen.SRC_ALPHA,
                    Screen.DST_RGB,
                    0
                ),
                end_offset: this.spriteDefs.length - 1,
            }],
        });


        this.spriteBuffer = TileMap.SpriteBuffer.fromObjects(this.spriteDefs);
        this.tileMap = new TileMap.Instance({ descriptor: this.descriptor, spriteBuffer: this.spriteBuffer });

        TileMap.init();
    }

    draw(x = 0, y = 0) {
        TileMap.begin();

        this.tileMap.render(x, y);
    }
}