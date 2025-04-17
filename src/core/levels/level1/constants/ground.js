import { TILE_SIZE } from "../../../Scene/constants/index.js"

const groundQuarterFloor = [
  {
    tileColumn: 6,
    tileRow: 0,
    tileX: 224,
    tileY: 280
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 240 + i * TILE_SIZE,
    tileY: 280
  })),
  {
    tileColumn: 8,
    tileRow: 0,
    tileX: 368,
    tileY: 280
  },
]

const groundThirdFloor = [
  {
    tileColumn: 6,
    tileRow: 1,
    tileX: 224,
    tileY: 296
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 240 + i * TILE_SIZE,
    tileY: 296
  })),
  {
    tileColumn: 8,
    tileRow: 1,
    tileX: 368,
    tileY: 296
  },
  {
    tileColumn: 6,
    tileRow: 0,
    tileX: 512,
    tileY: 296
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 528 + i * TILE_SIZE,
    tileY: 296
  })),
  {
    tileColumn: 8,
    tileRow: 0,
    tileX: 576,
    tileY: 296
  },
]

const groundSecondFloor = [
  {
    tileColumn: 6,
    tileRow: 0,
    tileX: 208,
    tileY: 312
  },
  {
    tileColumn: 7,
    tileRow: 0,
    tileX: 224,
    tileY: 312
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 240 + i * TILE_SIZE,
    tileY: 312
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 368 + i * TILE_SIZE,
    tileY: 312
  })),
  {
    tileColumn: 8,
    tileRow: 0,
    tileX: 400,
    tileY: 312
  },
  {
    tileColumn: 6,
    tileRow: 1,
    tileX: 512,
    tileY: 312
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 528 + i * TILE_SIZE,
    tileY: 312
  })),
  {
    tileColumn: 8,
    tileRow: 1,
    tileX: 576,
    tileY: 312
  },
]

const groundFirstFloor = [
  {
    tileColumn: 6,
    tileRow: 0,
    tileX: 176,
    tileY: 328
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 192 + i * TILE_SIZE,
    tileY: 328
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 256 + i * TILE_SIZE,
    tileY: 328
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 400 + i * TILE_SIZE,
    tileY: 328
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 544 + i * TILE_SIZE,
    tileY: 328
  })),
]

const ground = [
  ...groundQuarterFloor,
  ...groundThirdFloor,
  ...groundSecondFloor,
  ...groundFirstFloor
]

export default ground;