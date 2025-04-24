const PATH_TO_ASSETS = './assets/';

export default class Animation {
  constructor(spritesheetPath, totalFrames, animationSpeed, frameWidth, frameHeight, loop, onAnimationEnd) {
    this.totalFrames = totalFrames;
    this.animationSpeed = animationSpeed;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.loop = loop;
    this.image = new Image(PATH_TO_ASSETS + spritesheetPath);
    this.onAnimationEnd = onAnimationEnd
  }
}
