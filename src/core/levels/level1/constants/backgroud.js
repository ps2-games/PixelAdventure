import TileTypes from "../../../../@types/tile-types.js";
import { BACKGROUND_SIZE, TILE_SIZE } from "../../../Scene/constants/index.js";

const topBlanketTiles = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 32 }, (_, col) => ({
    tileColumn: 1,
    tileRow: 1,
    tileX: 64 + col * TILE_SIZE,
    tileY: 24 + row * TILE_SIZE,
    type: TileTypes.BACKGROUND
  }))
).flat();

const bottomBlanketTiles = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 32 }, (_, col) => ({
    tileColumn: 1,
    tileRow: 1,
    tileX: 64 + col * TILE_SIZE,
    tileY: 360 + row * TILE_SIZE,
    type: TileTypes.BACKGROUND
  }))
).flat();

export const backgroundConfigLevel1 = {
  tileMap: Array.from({ length: 8 }, (_, col) => {
    return Array.from({ length: 5 }, (_, row) => ({
      tileX: 64 + col * BACKGROUND_SIZE,
      tileY: 104 + row * BACKGROUND_SIZE,
      rowIndex: row
    }));
  }).flat(),
  blanketMap: [...topBlanketTiles, ...bottomBlanketTiles],
  color: 'Brown',
  speed: 0.25,
  limitY: 48,
  resetY: 368
};

export default backgroundConfigLevel1;