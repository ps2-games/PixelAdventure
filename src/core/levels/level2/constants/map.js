import TileTypes from "../../../../@types/tile-types.js";
import { TILE_SIZE } from "../../../Scene/constants/index.js";
import ground from "./ground.js";

const leftWoodWall = Array.from({ length: 22 }, (_, i) => ({
    tileColumn: 2,
    tileRow: 5,
    tileX: 32,
    tileY: 48 + i * TILE_SIZE,
    type: TileTypes.WALL
}));

const topStoneWall = Array.from({ length: 34 }, (_, i) => ({
    tileColumn: 1,
    tileRow: 2,
    tileX: 48 + i * TILE_SIZE,
    tileY: 32,
    type: TileTypes.WALL
}));

const rightWoodWall = Array.from({ length: 16 }, (_, i) => ({
    tileColumn: 0,
    tileRow: 5,
    tileX: 592,
    tileY: 48 + i * TILE_SIZE,
    type: TileTypes.WALL
}))

const rightWoodSmallWall = Array.from({ length: 5 }, (_, i) => ({
    tileColumn: 0,
    tileRow: 5,
    tileX: 544,
    tileY: 320 + i * TILE_SIZE,
    type: TileTypes.WALL
}))

const rightWoodSmallGround = Array.from({ length: 2 }, (_, i) => ({
    tileColumn: 1,
    tileRow: 4,
    tileX: 560 + i * TILE_SIZE,
    tileY: 304,
    type: TileTypes.WALL
}))

const bottomStoneGround = Array.from({ length: 31 }, (_, i) => ({
    tileColumn: 1,
    tileRow: 0,
    tileX: 48 + i * TILE_SIZE,
    tileY: 400,
    type: TileTypes.WALL
}));

const fixedTiles = [
    { tileColumn: 3, tileRow: 4, tileX: 32, tileY: 32, type: TileTypes.WALL }, // leftTopSideWoodCorner
    { tileColumn: 3, tileRow: 5, tileX: 32, tileY: 400, type: TileTypes.WALL }, // leftBottomSideWoodCorner
    { tileColumn: 4, tileRow: 4, tileX: 592, tileY: 32, type: TileTypes.WALL }, // RightTopSideWoodCorner
    { tileColumn: 4, tileRow: 5, tileX: 592, tileY: 304, type: TileTypes.WALL }, // RightBottomSideWoodCorner
    { tileColumn: 0, tileRow: 4, tileX: 544, tileY: 304, type: TileTypes.GROUND }, //RightBottomSideWoodGround
    { tileColumn: 4, tileRow: 5, tileX: 544, tileY: 400, type: TileTypes.WALL }, //RightExtremBottomSideWood
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