import { TILE_SIZE } from "../../../Scene/constants/index.js";

const leftWood = Array.from({ length: 19 }, (_, i) => ({
  tileColumn: 2,
  tileRow: 5,
  tileX: 48,
  tileY: 64 + i * TILE_SIZE,
}));

const topStone = Array.from({ length: 32 }, (_, i) => ({
  tileColumn: 1,
  tileRow: 2,
  tileX: 64 + i * TILE_SIZE,
  tileY: 48,
}));

const bottomStone = Array.from({ length: 33 }, (_, i) => ({
  tileColumn: 1,
  tileRow: 0,
  tileX: 64 + i * TILE_SIZE,
  tileY: 368,
}));

const rightWoodTop = Array.from({ length: 3 }, (_, i) => ({
  tileColumn: 0,
  tileRow: 5,
  tileX: 592,
  tileY: 352 - i * TILE_SIZE,
}));

const rightWoodBottom = Array.from({ length: 16 }, (_, i) => ({
  tileColumn: 0,
  tileRow: 5,
  tileX: 576,
  tileY: 304 - i * TILE_SIZE,
}));

const fixedTiles = [
  { tileColumn: 4, tileRow: 4, tileX: 592, tileY: 304 },
  { tileColumn: 0, tileRow: 6, tileX: 576, tileY: 304 },
  { tileColumn: 3, tileRow: 4, tileX: 48, tileY: 48 },
  { tileColumn: 4, tileRow: 1, tileX: 592, tileY: 368 },
  { tileColumn: 3, tileRow: 5, tileX: 48, tileY: 368 },
  { tileColumn: 4, tileRow: 4, tileX: 576, tileY: 48 },
];

export const mapLevel1 = [
  ...leftWood,
  ...topStone,
  ...bottomStone,
  ...rightWoodTop,
  ...rightWoodBottom,
  ...fixedTiles,
];
