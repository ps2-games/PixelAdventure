import Animation from "../Animation/index.js";
import AnimationManager from "../AnimationManager/index.js";

export default class Player{

  constructor(width, height){

    const animations = {
      IDLE: new Animation("Sheets/ninjaFrog/Idle.png", 11, 100, 32, 32, true),
      RUN: new Animation("Sheets/ninjaFrog/Run.png", 12, 50, 32, 32, true),
      JUMP: new Animation("Sheets/ninjaFrog/Jump.png", 1, 100, 32, 32, false),
      FALL: new Animation("Sheets/ninjaFrog/Fall.png", 1, 100, 32, 32, false,)
    }

    this.animationManager = new AnimationManager(animations)
    this.flipX = false;
    this.pads = Pads.get();

    this.width = width;
    this.height = height;

    this.x = 0;
    this.y = this.height - this.animationManager.getCurrentAnimation().frameHeight;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = false;

    this.gravity = 0.5;
    this.jumpStrength = -8;
    this.horizontalVelocity = 3;
  }

  updateAnimation(){
    this.animationManager.updateAnimation()

    if (this.velocityY < 0) {
      this.animationManager.setAnimation('JUMP');
    } else if (this.velocityY > 0) {
      this.animationManager.setAnimation('FALL');
    }
  }

  update(){
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    if (this.y >= this.height - this.animationManager.getCurrentAnimation().frameHeight) {
      this.y = this.height - this.animationManager.getCurrentAnimation().frameHeight;
      this.velocityY = 0;
      this.isJumping = false;
    }

    this.updateAnimation();
  }

  draw(){
    const {frameWidth, frameHeight, image} = this.animationManager.getCurrentAnimation();
    const frameX = this.animationManager.getCurrentFrame() *frameWidth;

    image.startx = frameX;
    image.starty = 0;
    image.endx = frameX +frameWidth;
    image.endy =frameHeight;
    image.width = this.flipX ? -Math.abs(frameWidth) : Math.abs(frameWidth);;
    image.height =frameHeight;

    if (this.flipX) {
      image.width = -Math.abs(frameWidth);
      image.draw(this.x + frameWidth, this.y);
      return;
    }

    image.width = Math.abs(frameWidth);
    image.draw(this.x, this.y);
    return;
  }

  move(){
    this.pads.update();

    if (this.pads.pressed(Pads.RIGHT)) {
      this.moveRight();
    } else if (this.pads.pressed(Pads.LEFT)) {
      this.moveLeft();
    } else {
      this.animationManager.setAnimation('IDLE');
    }
  
    if (this.pads.pressed(Pads.UP)) {
      this.jump();
    }
  }

  moveRight() {
    this.velocityX = this.horizontalVelocity;
    this.x += this.velocityX;
    this.flipX = false;

    if (this.x + this.animationManager.getCurrentAnimation().frameWidth > this.width) {
      this.x = this.width - this.animationManager.getCurrentAnimation().frameWidth;
    }

    this.animationManager.setAnimation('RUN');
  }

  moveLeft() {
    this.velocityX = -this.horizontalVelocity;
    this.x += this.velocityX;
    this.flipX = true;

    if (this.x < 0) {
      this.x = 0;
    }

    this.animationManager.setAnimation('RUN');
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = this.jumpStrength;
      this.isJumping = true;

      this.animationManager.setAnimation('JUMP');
    }
  }
}