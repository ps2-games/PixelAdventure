import { TILE_SIZE } from "../../../Scene/constants/index.js";
import TileTypes from "../../../../@types/tile-types.js";

const leftSideStickPlatform = Array.from({ length: 4 }, (_, i) => ({
  tileColumn: i === 3 ? 19 : 18,
  tileRow: 1,
  tileX: 64 + i * TILE_SIZE,
  tileY: 296,
  type: TileTypes.PLATFORM
}))

const leftSideBoxPlatform = [
  {
    tileColumn: 12,
    tileRow: 1,
    tileX: 160,
    tileY: 216,
    type: TileTypes.GROUND
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    tileColumn: i === 0 ? 12 : i === 2 ? 14 : 13,
    tileRow: 0,
    tileX: 176 + i * TILE_SIZE,
    tileY: 216,
    type: TileTypes.GROUND
  }))
]

const rightSideCrossBoxPlatform = [
  ...Array.from({ length: 2 }, (_, i) => ({
    tileColumn: 12,
    tileRow: 1,
    tileX: 336 + i * TILE_SIZE,
    tileY: 184,
    type: TileTypes.GROUND
  })),
  {
    tileColumn: 15,
    tileRow: 0,
    tileX: 368,
    tileY: 184,
    type: TileTypes.GROUND
  },
  {
    tileColumn: 15,
    tileRow: 2,
    tileX: 368,
    tileY: 200,
    type: TileTypes.GROUND
  },
  {
    tileColumn: 12,
    tileRow: 1,
    tileX: 384,
    tileY: 184,
    type: TileTypes.GROUND
  }
]

const rightSideStickPlatform = Array.from({ length: 4 }, (_, i) => ({
  tileColumn: i === 3 ? 17 : 18,
  tileRow: 1,
  tileX: 560 - i * TILE_SIZE,
  tileY: 248,
  type: TileTypes.PLATFORM
}))

const platforms = [
  ...leftSideStickPlatform,
  ...leftSideBoxPlatform,
  ...rightSideCrossBoxPlatform,
  ...rightSideStickPlatform
]

export default platforms;