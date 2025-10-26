import { TILE_SIZE } from "../../../constants.js";
import FruitUtils from "../../../FruitUtils.js";

const fruitsLevel2 = [
    ...FruitUtils.drawVerticalLine(76, 330, 5, "Strawberry", TILE_SIZE * 3.8),
    ...FruitUtils.drawVerticalLine(48, 304, 5, "Strawberry", TILE_SIZE * 3.8),
    ...FruitUtils.drawHorizontalLine(250, 170, 6, "Strawberry", TILE_SIZE * 1.5),
    ...FruitUtils.drawHorizontalLine(440, 126, 2, "Bananas", TILE_SIZE * 4),
    ...FruitUtils.drawVerticalLine(190, 338, 8, "Bananas", TILE_SIZE * 2.25),
    ...FruitUtils.drawTriangle(464, 330, 3, "Bananas", TILE_SIZE * 1.5),
    ...FruitUtils.drawHorizontalLine(298, 340, 2, "Strawberry", TILE_SIZE * 2.5),
    ...FruitUtils.drawHorizontalLine(278, 362, 3, "Strawberry", TILE_SIZE * 2.5),
    {
        x: 560,
        y: 236,
        type: "Strawberry"
    }
]

export default fruitsLevel2;

