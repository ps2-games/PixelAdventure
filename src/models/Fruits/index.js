import Animation from "../Animation/index.js";
import AnimationManager from "../AnimationManager/index.js";
import { FruitsAnimationsStates } from "./state/animation.js";

export default class Fruit{
  constructor(fruit, xPosition, yPosition){
    this.fruit = fruit;

    this.initializeAnimations();

    this.x = xPosition;
    this.y = yPosition;
  }

  initializeAnimations() {
    const animations = {
      [FruitsAnimationsStates.IDLE]: new Animation(`Sheets/fruits/${this.fruit}.png`, 11, 50, 32, 32, true),
      [FruitsAnimationsStates.COLLECTED]: new Animation(`Sheets/fruits/Collected.png`, 6, 50, 32, 32, false),
    };
    
    this.animationManager = new AnimationManager(animations);
  }

  updateAnimation(){
    this.animationManager.updateAnimation()
  };

  draw(){
    const { frameWidth, frameHeight, image } = this.animationManager.getCurrentAnimation()
    const frameX = this.animationManager.getCurrentFrame() * frameWidth;

    image.startx = frameX;
    image.starty = 0;
    image.endx = frameX +frameWidth;
    image.endy =frameHeight;
    image.width = frameWidth;
    image.height =frameHeight;

    image.draw(this.x, this.y);
  };
}