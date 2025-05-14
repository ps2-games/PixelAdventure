import Animation from "../../Animation/index.js";
import { FruitsAnimationsStates } from "./state/animation.js";
import AnimatableEntity from "../AnimatableEntity/index.js";

export default class Fruit extends AnimatableEntity {

  constructor(fruit, xPosition, yPosition, collectedSound) {
    super(xPosition, yPosition, 32, 32, {
      [FruitsAnimationsStates.IDLE]: new Animation(
        `Sheets/fruits/${fruit}.png`,
        11,
        50,
        32,
        32,
        true
      ),
      [FruitsAnimationsStates.COLLECTED]: new Animation(
        `Sheets/fruits/Collected.png`,
        6,
        50,
        32,
        32,
        false
      ),
    });
    this.isCollected = false;
    this.collectedSound = collectedSound
  }

  collect(scene) {
    if (this.isCollected) return;
    this.collectedSound.play(scene.fruitSlot);

    scene.fruitSlot = (scene.fruitSlot + 1) & (scene.fruitSlotSize - 1);

    this.setAnimation(FruitsAnimationsStates.COLLECTED);
    this.isCollected = true;
  }


  update(collector, scene) {
    if (this.isCollected) {
      this.updateAnimation();
      return;
    }

    if (collector && this.isColliding(collector) && !collector.isDying) {
      this.collect(scene);
      this.isCollected = true;
    }

    this.updateAnimation();
  }

  shouldRemove() {
    return (
      this.isCollected &&
      this.isAnimationFinished()
    );
  }

  getBounds() {
    return {
      left: this.x + 8,
      top: this.y + 8,
      right: this.x + (this.width - 8),
      bottom: this.y + (this.height - 8)
    };
  }

  draw() {

    const { frameWidth, frameHeight, image } = this.getCurrentAnimation();
    const frameX = this.getCurrentFrame() * frameWidth;

    image.startx = frameX;
    image.starty = 0;
    image.endx = frameX + frameWidth;
    image.endy = frameHeight;
    image.width = frameWidth;
    image.height = frameHeight;

    image.draw(this.x, this.y);
  }

}