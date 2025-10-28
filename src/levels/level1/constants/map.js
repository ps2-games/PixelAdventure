import { TILE_SIZE, TILE_TYPES } from "../../../constants.js";

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

const leftSideStickPlatform = Array.from({ length: 4 }, (_, i) => ({
  tileColumn: i === 3 ? 19 : 18,
  tileRow: 1,
  tileX: 64 + i * TILE_SIZE,
  tileY: 296,
  type: TILE_TYPES.PLATFORM
}))

const leftSideBoxPlatform = [
  {
    tileColumn: 12,
    tileRow: 1,
    tileX: 160,
    tileY: 216,
    type: TILE_TYPES.GROUND
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    tileColumn: i === 0 ? 12 : i === 2 ? 14 : 13,
    tileRow: 0,
    tileX: 176 + i * TILE_SIZE,
    tileY: 216,
    type: TILE_TYPES.GROUND
  }))
]

const rightSideCrossBoxPlatform = [
  ...Array.from({ length: 2 }, (_, i) => ({
    tileColumn: 12,
    tileRow: 1,
    tileX: 336 + i * TILE_SIZE,
    tileY: 184,
    type: TILE_TYPES.GROUND
  })),
  {
    tileColumn: 15,
    tileRow: 0,
    tileX: 368,
    tileY: 184,
    type: TILE_TYPES.GROUND
  },
  {
    tileColumn: 15,
    tileRow: 2,
    tileX: 368,
    tileY: 200,
    type: TILE_TYPES.GROUND
  },
  {
    tileColumn: 12,
    tileRow: 1,
    tileX: 384,
    tileY: 184,
    type: TILE_TYPES.GROUND
  }
]

const rightSideStickPlatform = Array.from({ length: 4 }, (_, i) => ({
  tileColumn: i === 3 ? 17 : 18,
  tileRow: 1,
  tileX: 560 - i * TILE_SIZE,
  tileY: 248,
  type: TILE_TYPES.PLATFORM
}))

const mapLevel1 = [
  ...groundQuarterFloor,
  ...groundThirdFloor,
  ...groundSecondFloor,
  ...groundFirstFloor,
  ...leftWood,
  ...topStone,
  ...bottomStone,
  ...rightWoodTop,
  ...rightWoodBottom,
  ...fixedTiles,
  ...leftTopBigBox,
  ...leftSideStickPlatform,
  ...leftSideBoxPlatform,
  ...rightSideCrossBoxPlatform,
  ...rightSideStickPlatform
];

export default mapLevel1;