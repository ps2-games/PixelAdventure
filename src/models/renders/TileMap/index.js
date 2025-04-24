import { TILE_SIZE } from "../../../core/Scene/constants/index.js";

export default class TileMapRender {
    constructor(tileMapConfig) {
        this.tileset = new Image('./assets/tileset/Terrain16x16.png');
        this.collisionTiles = [];
        this.renderBatches = this.createOptimizedBatches(tileMapConfig);
    }

    createOptimizedBatches(tileMapConfig) {
        const batchMap = new Map();

        tileMapConfig.forEach(tile => {
            this.collisionTiles.push({
                x: tile.tileX,
                y: tile.tileY,
                width: TILE_SIZE,
                height: TILE_SIZE,
                type: tile.type
            });

            const batchKey = `${tile.tileColumn}_${tile.tileRow}`;

            if (!batchMap.has(batchKey)) {
                batchMap.set(batchKey, {
                    srcX: tile.tileColumn * TILE_SIZE,
                    srcY: tile.tileRow * TILE_SIZE,
                    positions: []
                });
            }

            batchMap.get(batchKey).positions.push(tile.tileX, tile.tileY);
        });

        return Array.from(batchMap.values());
    }

    render() {
        const ts = this.tileset;
        const tileSize = TILE_SIZE;

        ts.width = tileSize;
        ts.height = tileSize;

        this.renderBatches.forEach(batch => {
            ts.startx = batch.srcX;
            ts.starty = batch.srcY;
            ts.endx = batch.srcX + tileSize;
            ts.endy = batch.srcY + tileSize;

            const positions = batch.positions;
            for (let i = 0; i < positions.length; i += 2) {
                ts.draw(positions[i], positions[i + 1]);
            }
        });
    }
}