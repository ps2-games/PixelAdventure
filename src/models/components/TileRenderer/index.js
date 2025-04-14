import { TILE_SIZE } from "../../../core/Scene/constants/index.js";

export default class TileRenderer{

    constructor(){

    }

    drawBackgroundTile(backgroundTile, backgroundTileMap){
        for (const { tileX, tileY } of backgroundTileMap) {
            backgroundTile.draw(tileX, tileY);
        }
    }

    drawTiles(tilesetImage, tiles) {
        for (const { tileColumn, tileRow, tileX, tileY } of tiles) {
            const startX = tileColumn * TILE_SIZE;
            const startY = tileRow * TILE_SIZE;
            const endX = startX + TILE_SIZE;
            const endY = startY + TILE_SIZE;

            Object.assign(tilesetImage, {
                startx: startX,
                starty: startY,
                endx: endX,
                endy: endY,
                width: TILE_SIZE,
                height: TILE_SIZE
            });

            tilesetImage.draw(tileX, tileY);
        }
    }
}