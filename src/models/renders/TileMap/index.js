import mapLevel1 from "../../../core/levels/level1/constants/map.js";
import { TILE_SIZE } from "../../../core/Scene/constants/index.js";

export default class TileMapRender {

    constructor() {
        this.tileMap = this.createTileMap();
    }

    createTileMap() {
        const tileMap = [];
        const tileset = new Image('./assets/tileset/Terrain16x16.png');

        for (const { tileColumn, tileRow, tileX, tileY } of mapLevel1) {
            tileMap.push({
                tileset,
                startx: tileColumn * TILE_SIZE,
                starty: tileRow * TILE_SIZE,
                endx: tileColumn * TILE_SIZE + TILE_SIZE,
                endy: tileRow * TILE_SIZE + TILE_SIZE,
                x: tileX,
                y: tileY
            });
        }

        return tileMap;
    }

    render() {
        for (const tile of this.tileMap) {
            tile.tileset.startx = tile.startx;
            tile.tileset.starty = tile.starty;
            tile.tileset.endx = tile.endx;
            tile.tileset.endy = tile.endy;
            tile.tileset.width = TILE_SIZE;
            tile.tileset.height = TILE_SIZE;
            tile.tileset.draw(tile.x, tile.y);
        }
    }
}