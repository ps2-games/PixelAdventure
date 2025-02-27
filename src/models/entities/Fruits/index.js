import AnimatedEntity from "../../behaviors/AnimatedEntity/index.js";
import Animation from "../../components/Animation/index.js";
import { FruitsAnimationsStates } from "./state/animation.js";

export default class Fruit extends AnimatedEntity{
  constructor(fruit, xPosition, yPosition){
    super(xPosition, yPosition); 

    this.fruit = fruit;
    this.initializeAnimations();
  }

  initializeAnimations() {
    const animations = {
      [FruitsAnimationsStates.IDLE]: new Animation(`Sheets/fruits/${this.fruit}.png`, 11, 50, 32, 32, true),
      [FruitsAnimationsStates.COLLECTED]: new Animation(`Sheets/fruits/Collected.png`, 6, 50, 32, 32, false),
    };
    
    super.initializeAnimations(animations);
  }

  collect() {
    this.setAnimation(FruitsAnimationsStates.COLLECTED);
  }

  draw(){
    const { frameWidth, frameHeight, image } = this.animationManager.getCurrentAnimation()
    const frameX = this.animationManager.getCurrentFrame() * frameWidth;

    image.startx = frameX;
    image.starty = 0;
    image.endx = frameX + frameWidth;
    image.endy =frameHeight;
    image.width = frameWidth;
    image.height =frameHeight;

    image.draw(this.x, this.y);
  };
}