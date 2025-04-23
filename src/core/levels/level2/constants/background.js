import TileTypes from "../../../../@types/tile-types.js";
import { BACKGROUND_SIZE, TILE_SIZE } from "../../../Scene/constants/index.js";

const topBlanketTiles = Array.from({ length: 2 }, (_, row) =>
    Array.from({ length: 35 }, (_, col) => ({
        tileColumn: 1,
        tileRow: 1,
        tileX: 48 + col * TILE_SIZE,
        tileY: 0 + row * TILE_SIZE,
        type: TileTypes.BACKGROUND
    }))
).flat();

const bottomBlanketTiles = Array.from({ length: 2 }, (_, row) =>
    Array.from({ length: 32 }, (_, col) => ({
        tileColumn: 1,
        tileRow: 1,
        tileX: 48 + col * TILE_SIZE,
        tileY: 432 - row * TILE_SIZE,
        type: TileTypes.BACKGROUND
    }))
).flat();

const bottomLeftBlanketTiles = Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 3 }, (_, col) => ({
        tileColumn: 1,
        tileRow: 1,
        tileX: 560 + col * TILE_SIZE,
        tileY: 432 - row * TILE_SIZE,
        type: TileTypes.BACKGROUND
    }))
).flat();

const leftWallBlanketTiles = Array.from({ length: 28 }, (_, row) => ({
    tileColumn: 1,
    tileRow: 1,
    tileX: 608,
    tileY: 432 - row * TILE_SIZE,
    type: TileTypes.BACKGROUND
}));

export const backgroundConfigLevel2 = {
    tileMap: Array.from({ length: 9 }, (_, col) => {
        return Array.from({ length: 7 }, (_, row) => ({
            tileX: 48 + col * BACKGROUND_SIZE,
            tileY: 32 + row * BACKGROUND_SIZE
        }));
    }).flat(),
    blanketMap: [...topBlanketTiles, ...bottomBlanketTiles, ...bottomLeftBlanketTiles, ...leftWallBlanketTiles],
    color: 'Yellow',
    speed: 0.25,
    limitY: -32,
    resetY: 416
};

export default backgroundConfigLevel2;