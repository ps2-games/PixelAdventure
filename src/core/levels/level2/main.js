import backgroundConfigLevel2 from "./constants/background.js";
import fruitsLevel2 from "./constants/fruits.js";
import mapLevel2 from "./constants/map.js";

const level2Config = {
    backgroundConfig: backgroundConfigLevel2,
    tileMapConfig: mapLevel2,
    fruits: fruitsLevel2,
    traps: null,
    initialPlayerPosition: {
        x: 64,
        y: 367
    }
}

export default level2Config;