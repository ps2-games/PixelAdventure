import { TILE_SIZE, TILE_TYPES } from "../../../constants.js";
import ground from "./ground.js";

const leftWoodWall = Array.from({ length: 22 }, (_, i) => ({
    tileColumn: 2,
    tileRow: 5,
    tileX: 32,
    tileY: 48 + i * TILE_SIZE,
    type: TILE_TYPES.WALL
}));

const topStoneWall = Array.from({ length: 34 }, (_, i) => ({
    tileColumn: 1,
    tileRow: 2,
    tileX: 48 + i * TILE_SIZE,
    tileY: 32,
    type: TILE_TYPES.WALL
}));

const rightWoodWall = Array.from({ length: 16 }, (_, i) => ({
    tileColumn: 0,
    tileRow: 5,
    tileX: 592,
    tileY: 48 + i * TILE_SIZE,
    type: TILE_TYPES.WALL
}))

const rightWoodSmallWall = Array.from({ length: 5 }, (_, i) => ({
    tileColumn: 0,
    tileRow: 5,
    tileX: 544,
    tileY: 320 + i * TILE_SIZE,
    type: TILE_TYPES.WALL
}))

const rightWoodSmallGround = Array.from({ length: 2 }, (_, i) => ({
    tileColumn: 1,
    tileRow: 4,
    tileX: 560 + i * TILE_SIZE,
    tileY: 304,
    type: TILE_TYPES.WALL
}))

const bottomStoneGround = Array.from({ length: 31 }, (_, i) => ({
    tileColumn: 1,
    tileRow: 0,
    tileX: 48 + i * TILE_SIZE,
    tileY: 400,
    type: TILE_TYPES.WALL
}));

const fixedTiles = [
    { tileColumn: 3, tileRow: 4, tileX: 32, tileY: 32, type: TILE_TYPES.WALL }, // leftTopSideWoodCorner
    { tileColumn: 3, tileRow: 5, tileX: 32, tileY: 400, type: TILE_TYPES.WALL }, // leftBottomSideWoodCorner
    { tileColumn: 4, tileRow: 4, tileX: 592, tileY: 32, type: TILE_TYPES.WALL }, // RightTopSideWoodCorner
    { tileColumn: 4, tileRow: 5, tileX: 592, tileY: 304, type: TILE_TYPES.WALL }, // RightBottomSideWoodCorner
    { tileColumn: 0, tileRow: 4, tileX: 544, tileY: 304, type: TILE_TYPES.GROUND }, //RightBottomSideWoodGround
    { tileColumn: 4, tileRow: 5, tileX: 544, tileY: 400, type: TILE_TYPES.WALL }, //RightExtremBottomSideWood
]

const mapLevel2 = [
    ...ground,
    ...leftWoodWall,
    ...topStoneWall,
    ...rightWoodWall,
    ...bottomStoneGround,
    ...rightWoodSmallWall,
    ...rightWoodSmallGround,
    ...fixedTiles
]

export default mapLevel2