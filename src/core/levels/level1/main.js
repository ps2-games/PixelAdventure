import backgroundConfigLevel1 from "./constants/backgroud.js";
import fruitsLevel1 from "./constants/fruits.js";
import mapLevel1 from "./constants/map.js";

const level1Config = {
    backgroundConfig: backgroundConfigLevel1,
    tileMapConfig: mapLevel1,
    fruits: fruitsLevel1,
    traps: null,
    initialPlayerPosition: {
        x: 320,
        y: 224
    }
}

export default level1Config;