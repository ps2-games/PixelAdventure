import { TILE_SIZE, TILE_TYPES } from "../../../constants.js";


const leftGroundPilar = [
    ...Array.from({ length: 16 }, (_, i) => ({
        tileColumn: 6,
        tileRow: 1,
        tileX: 108,
        tileY: 384 - i * TILE_SIZE,
        type: TILE_TYPES.GROUND
    })),
    {
        tileColumn: 6,
        tileRow: 0,
        tileX: 108,
        tileY: 128,
        type: TILE_TYPES.GROUND
    },
    ...Array.from({ length: 16 }, (_, i) => ({
        tileColumn: 8,
        tileRow: 1,
        tileX: 156,
        tileY: 384 - i * TILE_SIZE,
        type: TILE_TYPES.GROUND
    })),
    {
        tileColumn: 8,
        tileRow: 0,
        tileX: 156,
        tileY: 128,
        type: TILE_TYPES.GROUND
    },
    ...Array.from({ length: 9 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 124,
        tileY: 384 - i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    ...Array.from({ length: 9 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 140,
        tileY: 384 - i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    {
        tileColumn: 9,
        tileRow: 1,
        tileX: 124,
        tileY: 240,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    {
        tileColumn: 10,
        tileRow: 1,
        tileX: 140,
        tileY: 240,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    {
        tileColumn: 9,
        tileRow: 0,
        tileX: 124,
        tileY: 224,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    {
        tileColumn: 10,
        tileRow: 0,
        tileX: 140,
        tileY: 224,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    ...Array.from({ length: 5 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 140,
        tileY: 208 - i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 124,
        tileY: 208 - i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    ...Array.from({ length: 2 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 0,
        tileX: 124 + i * TILE_SIZE,
        tileY: 128,
        type: TILE_TYPES.GROUND
    })),
]

const floatCenterGroundPlatform = [
    {
        tileColumn: 6,
        tileRow: 0,
        tileX: 256,
        tileY: 200,
        type: TILE_TYPES.GROUND
    },
    {
        tileColumn: 6,
        tileRow: 1,
        tileX: 256,
        tileY: 216,
        type: TILE_TYPES.GROUND
    },
    {
        tileColumn: 14,
        tileRow: 1,
        tileX: 256,
        tileY: 232,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    {
        tileColumn: 14,
        tileRow: 2,
        tileX: 256,
        tileY: 248,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    {
        tileColumn: 13,
        tileRow: 1,
        tileX: 240,
        tileY: 232,
        type: TILE_TYPES.GROUND
    },
    {
        tileColumn: 13,
        tileRow: 2,
        tileX: 240,
        tileY: 248,
        type: TILE_TYPES.GROUND
    },
    {
        tileColumn: 6,
        tileRow: 1,
        tileX: 256,
        tileY: 264,
        type: TILE_TYPES.GROUND
    },
    {
        tileColumn: 6,
        tileRow: 2,
        tileX: 256,
        tileY: 280,
        type: TILE_TYPES.GROUND
    },
    ...Array.from({ length: 7 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 2,
        tileX: 272 + i * TILE_SIZE,
        tileY: 280,
        type: TILE_TYPES.GROUND
    })),
    {
        tileColumn: 8,
        tileRow: 2,
        tileX: 384,
        tileY: 280,
        type: TILE_TYPES.GROUND
    },
    {
        tileColumn: 8,
        tileRow: 0,
        tileX: 384,
        tileY: 200,
        type: TILE_TYPES.GROUND
    },
    ...Array.from({ length: 4 }, (_, i) => ({
        tileColumn: 8,
        tileRow: 1,
        tileX: 384,
        tileY: 216 + i * TILE_SIZE,
        type: TILE_TYPES.GROUND
    })),
    ...Array.from({ length: 7 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 0,
        tileX: 272 + i * TILE_SIZE,
        tileY: 200,
        type: TILE_TYPES.GROUND
    })),
    ...Array.from({ length: 2 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 272,
        tileY: 216 + i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    ...Array.from({ length: 2 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 288,
        tileY: 216 + i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    {
        tileColumn: 9,
        tileRow: 0,
        tileX: 272,
        tileY: 248,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    {
        tileColumn: 10,
        tileRow: 0,
        tileX: 288,
        tileY: 248,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    {
        tileColumn: 9,
        tileRow: 1,
        tileX: 272,
        tileY: 264,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    {
        tileColumn: 10,
        tileRow: 1,
        tileX: 288,
        tileY: 264,
        type: TILE_TYPES.NON_COLLIDABLE
    },
    ...Array.from({ length: 4 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 304,
        tileY: 216 + i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 320,
        tileY: 216 + i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 336,
        tileY: 216 + i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 352,
        tileY: 216 + i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 368,
        tileY: 216 + i * TILE_SIZE,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
]

const rightGround = [
    {
        tileColumn: 6,
        tileRow: 1,
        tileX: 416,
        tileY: 384,
        type: TILE_TYPES.GROUND
    },
    ...Array.from({ length: 7 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 1,
        tileX: 432 + i * TILE_SIZE,
        tileY: 384,
        type: TILE_TYPES.NON_COLLIDABLE
    })),
    {
        tileColumn: 6,
        tileRow: 0,
        tileX: 416,
        tileY: 368,
        type: TILE_TYPES.GROUND
    },
    ...Array.from({ length: 7 }, (_, i) => ({
        tileColumn: 7,
        tileRow: 0,
        tileX: 432 + i * TILE_SIZE,
        tileY: 368,
        type: TILE_TYPES.GROUND
    }))
]

const rightBox = [
    {
        tileColumn: 14,
        tileRow: 1,
        tileX: 576,
        tileY: 272,
        type: TILE_TYPES.GROUND
    },
    {
        tileColumn: 14,
        tileRow: 2,
        tileX: 576,
        tileY: 288,
        type: TILE_TYPES.GROUND
    },
    {
        tileColumn: 13,
        tileRow: 1,
        tileX: 560,
        tileY: 272,
        type: TILE_TYPES.GROUND
    },
    {
        tileColumn: 13,
        tileRow: 2,
        tileX: 560,
        tileY: 288,
        type: TILE_TYPES.GROUND
    },
]

const ground = [
    ...leftGroundPilar,
    ...floatCenterGroundPlatform,
    ...rightGround,
    ...rightBox,
    {
        tileColumn: 12,
        tileRow: 1,
        tileX: 576,
        tileY: 200,
        type: TILE_TYPES.GROUND
    },
]

export default ground;