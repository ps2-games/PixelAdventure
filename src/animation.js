import Assets from "./assets.js";
import { ASSETS_PATH } from "./constants.js";

export default class Animation {
    constructor(spritesheetPath, totalFrames, animationSpeed, frameWidth, frameHeight, loop, onAnimationEnd) {
        this.totalFrames = totalFrames;
        this.animationSpeed = animationSpeed;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.loop = loop;
        this.image = Assets.image(`${ASSETS_PATH.Sheets}/${spritesheetPath}`);
        this.onAnimationEnd = onAnimationEnd
    }
}
