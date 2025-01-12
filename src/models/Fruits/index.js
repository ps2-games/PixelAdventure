const PATH_TO_ASSETS = './assets'

export class Fruit{
  constructor(fruit, width, height){
    this.fruit = fruit;

    this.animations = {
      IDLE: {
        spritesheetPath: `${PATH_TO_ASSETS}/Sheets/fruits/${this.fruit}.png`,
        totalFrames: 11,
        animationSpeed: 50,
        frameWidth: 32,
        frameHeight: 32,
        loop: true
      }
    };

    this.currentAnimation = this.animations.IDLE;
    this.currentFrame = 0;
    this.lastUpdate = Date.now();

    this.width = width;
    this.height = height;

    this.x = width / 2;
    this.y = height / 2;
  }

  
  updateAnimation(){
    const now = Date.now();

    if (now - this.lastUpdate > this.currentAnimation.animationSpeed) {
      this.currentFrame = (this.currentFrame + 1) % this.currentAnimation.totalFrames;
      this.lastUpdate = now;

      if (!this.currentAnimation.loop && this.currentFrame === this.currentAnimation.totalFrames - 1) {
        this.currentFrame = 0;
      };
    };
  };

  draw(){
    const { frameWidth, frameHeight, spritesheetPath } = this.currentAnimation;
    const frameX = this.currentFrame * frameWidth;
    const frameImage = new Image(spritesheetPath);

    frameImage.startx = frameX;
    frameImage.starty = 0;
    frameImage.endx = frameX +frameWidth;
    frameImage.endy =frameHeight;
    frameImage.width = frameWidth;
    frameImage.height =frameHeight;

    frameImage.draw(this.x, this.y);
  };
}