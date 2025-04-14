import { BACKGROUND_SIZE } from "../../../Scene/constants/index.js";

export const backgroundTileMapLevel1 = Array.from({length: 8}, (_, col) => {
  return Array.from({length: 5}, (_, row) => ({
    tileX: 64 + col * BACKGROUND_SIZE,
    tileY: 64 + row * BACKGROUND_SIZE
  }));
}).flat();

export const backgroundColorLevel1 = 'Brown'