const PATH_TO_ASSETS = './assets/'

export class Player{

  constructor(width, height){
    this.animations = {
      IDLE: {
        spritesheetPath: PATH_TO_ASSETS + "Sheets/ninjaFrog/Idle.png",
        totalFrames: 11,
        animationSpeed: 100,
        frameWidth: 32,
        frameHeight: 32,
        loop: true
      },
      RUN: {
        spritesheetPath: PATH_TO_ASSETS + "Sheets/ninjaFrog/Run.png",
        totalFrames: 12,
        animationSpeed: 50,
        frameWidth: 32,
        frameHeight: 32,
        loop: true
      },
      JUMP: {
        spritesheetPath: PATH_TO_ASSETS + "Sheets/ninjaFrog/Jump.png",
        totalFrames: 1,
        animationSpeed: 100,
        frameWidth: 32,
        frameHeight: 32,
        loop: false
      },
      FALL: {
        spritesheetPath: PATH_TO_ASSETS + "Sheets/ninjaFrog/Fall.png",
        totalFrames: 1,
        animationSpeed: 100,
        frameWidth: 32,
        frameHeight: 32,
        loop: false
      },
    };

    this.flipX = false;
    this.currentAnimation = this.animations.IDLE;
    this.currentFrame = 0;
    this.lastUpdate = Date.now();

    this.width = width;
    this.height = height;

    this.x = 0;
    this.y = this.height - this.currentAnimation.frameHeight;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = false;

    this.gravity = 0.5;
    this.jumpStrength = -8;
    this.horizontalVelocity = 3;
  }

  updateAnimation(){
    const now = Date.now();
    if (now - this.lastUpdate > this.currentAnimation.animationSpeed) {
      this.currentFrame = (this.currentFrame + 1) % this.currentAnimation.totalFrames;
      this.lastUpdate = now;

      if (!this.currentAnimation.loop && this.currentFrame === this.currentAnimation.totalFrames - 1) {
        this.currentFrame = 0;
      }
    }

    if (this.velocityY < 0) {
      this.setAnimation('JUMP');
    } else if (this.velocityY > 0) {
      this.setAnimation('FALL');
    }
  }

  update(){
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    if (this.y >= this.height - this.currentAnimation.frameHeight) {
      this.y = this.height - this.currentAnimation.frameHeight;
      this.velocityY = 0;
      this.isJumping = false;
    }

    this.updateAnimation();
  }

  draw(){
    const {frameWidth, frameHeight, spritesheetPath} = this.currentAnimation;
    const frameX = this.currentFrame *frameWidth;
    const frameImage = new Image(spritesheetPath);

    frameImage.startx = frameX;
    frameImage.starty = 0;
    frameImage.endx = frameX +frameWidth;
    frameImage.endy =frameHeight;
    frameImage.width = this.flipX ? -Math.abs(frameWidth) : Math.abs(frameWidth);;
    frameImage.height =frameHeight;

    if (this.flipX) {
      frameImage.width = -Math.abs(frameWidth);
      frameImage.draw(this.x + frameWidth, this.y);
      return;
    }

    frameImage.width = Math.abs(frameWidth);
    frameImage.draw(this.x, this.y);
    return;
  }

  moveRight() {
    this.velocityX = this.horizontalVelocity;
    this.x += this.velocityX;
    this.flipX = false;

    if (this.x + this.currentAnimation.frameWidth > this.width) {
      this.x = this.width - this.currentAnimation.frameWidth;
    }

    this.setAnimation('RUN');
  }

  moveLeft() {
    this.velocityX = -this.horizontalVelocity;
    this.x += this.velocityX;
    this.flipX = true;

    if (this.x < 0) {
      this.x = 0;
    }

    this.setAnimation('RUN');
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = this.jumpStrength;
      this.isJumping = true;

      this.setAnimation('JUMP');
    }
  }

  setAnimation(name) {
    if (this.animations[name] && this.currentAnimation !== this.animations[name]) {
      this.currentAnimation = this.animations[name];
      this.currentFrame = 0;
    }
  }

}