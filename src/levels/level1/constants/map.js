import { TILE_SIZE, TILE_TYPES } from "../../../constants.js";
import ground from "./ground.js";
import platforms from "./platforms.js";

const leftWood = Array.from({ length: 15 }, (_, i) => ({
  tileColumn: 2,
  tileRow: 5,
  tileX: 48,
  tileY: 104 + i * TILE_SIZE,
  type: TILE_TYPES.WALL
}));

const topStone = Array.from({ length: 32 }, (_, i) => ({
  tileColumn: 1,
  tileRow: 2,
  tileX: 64 + i * TILE_SIZE,
  tileY: 104,
  type: TILE_TYPES.WALL
}));

const bottomStone = Array.from({ length: 33 }, (_, i) => ({
  tileColumn: 1,
  tileRow: 0,
  tileX: 64 + i * TILE_SIZE,
  tileY: 344,
  type: TILE_TYPES.GROUND
}));

const rightWoodTop = Array.from({ length: 3 }, (_, i) => ({
  tileColumn: 0,
  tileRow: 5,
  tileX: 592,
  tileY: 328 - i * TILE_SIZE,
  type: TILE_TYPES.WALL
}));

const leftTopBigBox = Array.from({ length: 4 }, (_, i) => ({
  tileColumn: 13 + (i % 2),
  tileRow: 1 + Math.floor(i / 2),
  tileX: 64 + (i % 2) * TILE_SIZE,
  tileY: 120 + Math.floor(i / 2) * TILE_SIZE,
  type: TILE_TYPES.WALL
}));

const rightWoodBottom = Array.from({ length: 12 }, (_, i) => ({
  tileColumn: 0,
  tileRow: 5,
  tileX: 576,
  tileY: 280 - i * TILE_SIZE,
  type: TILE_TYPES.WALL
}));

const fixedTiles = [
  { tileColumn: 4, tileRow: 4, tileX: 592, tileY: 280, type: TILE_TYPES.WALL },
  { tileColumn: 0, tileRow: 6, tileX: 576, tileY: 280, type: TILE_TYPES.WALL },
  { tileColumn: 3, tileRow: 4, tileX: 48, tileY: 104, type: TILE_TYPES.WALL }, // leftTopSideWoodCorner
  { tileColumn: 4, tileRow: 1, tileX: 592, tileY: 344, type: TILE_TYPES.WALL }, // RightBottomStoneCorner
  { tileColumn: 3, tileRow: 5, tileX: 48, tileY: 344, type: TILE_TYPES.WALL }, //leftBottomWoodCorner
  { tileColumn: 4, tileRow: 4, tileX: 576, tileY: 104, type: TILE_TYPES.WALL }, // rightTopSideWoodCorner
  { tileColumn: 12, tileRow: 1, tileX: 96, tileY: 120, type: TILE_TYPES.WALL }, // leftTopSmallBox
  { tileColumn: 12, tileRow: 1, tileX: 576, tileY: 328, type: TILE_TYPES.WALL } // rightBottomSmallBox
];

const mapLevel1 = [
  ...ground,
  ...leftWood,
  ...topStone,
  ...bottomStone,
  ...rightWoodTop,
  ...rightWoodBottom,
  ...fixedTiles,
  ...leftTopBigBox,
  ...platforms
];

export default mapLevel1;