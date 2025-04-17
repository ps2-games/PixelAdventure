import { BACKGROUND_SIZE } from "../../../Scene/constants/index.js";

export const backgroundConfigLevel1 = {
  tileMap: Array.from({ length: 8 }, (_, col) => {
    return Array.from({ length: 4 }, (_, row) => ({
      tileX: 64 + col * BACKGROUND_SIZE,
      tileY: 104 + row * BACKGROUND_SIZE
    }));
  }).flat(),
  color: 'Brown',
  speed: 1.0
};

export default backgroundConfigLevel1;