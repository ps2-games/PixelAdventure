import FruitUtils from "../../../../models/entities/Fruits/utils/index.js";
import { TILE_SIZE } from "../../../Scene/constants/index.js";

const fruitsLevel1 = [
    ...FruitUtils.drawHorizontalLine(60, 312, 3, "Cherries", TILE_SIZE * 2),
    ...FruitUtils.drawTriangle(176, 184, 3, "Apple", 24),
    ...FruitUtils.drawTriangle(352, 152, 2, "Orange", TILE_SIZE * 2),
    ...FruitUtils.drawVerticalLine(536, 208, 3, "Pineapple", TILE_SIZE * 2)
]

export default fruitsLevel1;

