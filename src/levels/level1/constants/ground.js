import { TILE_SIZE, TILE_TYPES } from "../../../constants.js";

const groundQuarterFloor = [
  {
    tileColumn: 6,
    tileRow: 0,
    tileX: 224,
    tileY: 280,
    type: TILE_TYPES.GROUND
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 240 + i * TILE_SIZE,
    tileY: 280,
    type: TILE_TYPES.GROUND
  })),
  {
    tileColumn: 8,
    tileRow: 0,
    tileX: 368,
    tileY: 280,
    type: TILE_TYPES.GROUND
  },
]

const groundThirdFloor = [
  {
    tileColumn: 6,
    tileRow: 1,
    tileX: 224,
    tileY: 296,
    type: TILE_TYPES.GROUND
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 240 + i * TILE_SIZE,
    tileY: 296,
    type: TILE_TYPES.NON_COLLIDABLE
  })),
  {
    tileColumn: 8,
    tileRow: 1,
    tileX: 368,
    tileY: 296,
    type: TILE_TYPES.GROUND
  },
  {
    tileColumn: 6,
    tileRow: 0,
    tileX: 512,
    tileY: 296,
    type: TILE_TYPES.GROUND
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 528 + i * TILE_SIZE,
    tileY: 296,
    type: TILE_TYPES.GROUND
  })),
  {
    tileColumn: 8,
    tileRow: 0,
    tileX: 576,
    tileY: 296,
    type: TILE_TYPES.NON_COLLIDABLE
  },
]

const groundSecondFloor = [
  {
    tileColumn: 6,
    tileRow: 0,
    tileX: 208,
    tileY: 312,
    type: TILE_TYPES.GROUND
  },
  {
    tileColumn: 7,
    tileRow: 0,
    tileX: 224,
    tileY: 312,
    type: TILE_TYPES.NON_COLLIDABLE
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 240 + i * TILE_SIZE,
    tileY: 312,
    type: TILE_TYPES.NON_COLLIDABLE
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 368 + i * TILE_SIZE,
    tileY: 312,
    type: i === 0 ? TILE_TYPES.GROUND : TILE_TYPES.NON_COLLIDABLE
  })),
  {
    tileColumn: 8,
    tileRow: 0,
    tileX: 400,
    tileY: 312,
    type: TILE_TYPES.GROUND
  },
  {
    tileColumn: 6,
    tileRow: 1,
    tileX: 512,
    tileY: 312,
    type: TILE_TYPES.GROUND
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 528 + i * TILE_SIZE,
    tileY: 312,
    type: TILE_TYPES.NON_COLLIDABLE
  })),
  {
    tileColumn: 8,
    tileRow: 1,
    tileX: 576,
    tileY: 312,
    type: TILE_TYPES.NON_COLLIDABLE
  },
]

const groundFirstFloor = [
  {
    tileColumn: 6,
    tileRow: 0,
    tileX: 176,
    tileY: 328,
    type: TILE_TYPES.GROUND
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 192 + i * TILE_SIZE,
    tileY: 328,
    type: i === 0 ? TILE_TYPES.GROUND : TILE_TYPES.NON_COLLIDABLE
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 256 + i * TILE_SIZE,
    tileY: 328,
    type: TILE_TYPES.NON_COLLIDABLE
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 0,
    tileX: 400 + i * TILE_SIZE,
    tileY: 328,
    type: i === 0 || i > 6 ? TILE_TYPES.NON_COLLIDABLE : TILE_TYPES.GROUND
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    tileColumn: 7,
    tileRow: 1,
    tileX: 544 + i * TILE_SIZE,
    tileY: 328,
    type: TILE_TYPES.NON_COLLIDABLE
  })),
]

const ground = [
  ...groundQuarterFloor,
  ...groundThirdFloor,
  ...groundSecondFloor,
  ...groundFirstFloor
]

export default ground;