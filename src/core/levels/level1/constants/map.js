import { TILE_SIZE } from "../../../Scene/constants/index.js";
import ground from "./ground.js";
import platforms from "./platforms.js";

const leftWood = Array.from({ length: 15 }, (_, i) => ({
  tileColumn: 2,
  tileRow: 5,
  tileX: 48,
  tileY: 104 + i * TILE_SIZE,
}));

const topStone = Array.from({ length: 32 }, (_, i) => ({
  tileColumn: 1,
  tileRow: 2,
  tileX: 64 + i * TILE_SIZE,
  tileY: 104,
}));

const bottomStone = Array.from({ length: 33 }, (_, i) => ({
  tileColumn: 1,
  tileRow: 0,
  tileX: 64 + i * TILE_SIZE,
  tileY: 344,
}));

const rightWoodTop = Array.from({ length: 3 }, (_, i) => ({
  tileColumn: 0,
  tileRow: 5,
  tileX: 592,
  tileY: 328 - i * TILE_SIZE,
}));

const leftTopBigBox = Array.from({ length: 4 }, (_, i) => ({
  tileColumn: 13 + (i % 2),
  tileRow: 1 + Math.floor(i / 2),
  tileX: 64 + (i % 2) * TILE_SIZE,
  tileY: 120 + Math.floor(i / 2) * TILE_SIZE,
}));

const rightWoodBottom = Array.from({ length: 12 }, (_, i) => ({
  tileColumn: 0,
  tileRow: 5,
  tileX: 576,
  tileY: 280 - i * TILE_SIZE,
}));

const fixedTiles = [
  { tileColumn: 4, tileRow: 4, tileX: 592, tileY: 280 },
  { tileColumn: 0, tileRow: 6, tileX: 576, tileY: 280 },
  { tileColumn: 3, tileRow: 4, tileX: 48, tileY: 104 }, // leftTopSideWoodCorner
  { tileColumn: 4, tileRow: 1, tileX: 592, tileY: 344 }, // leftBottomStoneCorner
  { tileColumn: 3, tileRow: 5, tileX: 48, tileY: 344 }, //leftBottomWoodCorner
  { tileColumn: 4, tileRow: 4, tileX: 576, tileY: 104 }, // rightTopSideWoodCorner
  { tileColumn: 12, tileRow: 1, tileX: 96, tileY: 128 - 8 }, // leftTopSmallBox
  { tileColumn: 12, tileRow: 1, tileX: 576, tileY: 336 - 8 } // rightBottomSmallBox
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