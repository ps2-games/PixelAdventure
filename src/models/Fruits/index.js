const PATH_TO_ASSETS = './assets'

export default class Fruit{
  constructor(fruit, width, height, xPosition, yPosition){
    this.fruit = fruit;

    this.animations = {
      IDLE: {
        spritesheetPath: `${PATH_TO_ASSETS}/Sheets/fruits/${this.fruit}.png`,
        totalFrames: 11,
        animationSpeed: 50,
        frameWidth: 32,
        frameHeight: 32,
        loop: true,
        image: null
      },
      COLLECTED: {
        spritesheetPath: `${PATH_TO_ASSETS}/Sheets/fruits/Collected.png`,
        totalFrames: 6,
        animationSpeed: 50,
        frameWidth: 32,
        frameHeight: 32,
        loop: true,
        image: null
      }
    };
    
    for (const key in this.animations) {
      const animation = this.animations[key];
      animation.image = new Image(animation.spritesheetPath);
    }

    this.currentAnimation = this.animations.IDLE;
    this.currentFrame = 0;
    this.lastUpdate = Date.now();

    this.width = width;
    this.height = height;

    this.x = xPosition;
    this.y = yPosition;
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
    const { frameWidth, frameHeight, image } = this.currentAnimation;
    const frameX = this.currentFrame * frameWidth;

    image.startx = frameX;
    image.starty = 0;
    image.endx = frameX +frameWidth;
    image.endy =frameHeight;
    image.width = frameWidth;
    image.height =frameHeight;

    image.draw(this.x, this.y);
  };
}