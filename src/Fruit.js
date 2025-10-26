import AnimatableEntity from "./AnimatableEntity.js";
import Animation from "./animation.js";


const FRUIT_ANIMATION_STATE = {
  IDLE: 'IDLE',
  COLLECTED: 'COLLECTED'
};


export default class Fruit extends AnimatableEntity {

  constructor(fruit, xPosition, yPosition, collectedSound) {
    super(xPosition, yPosition, 32, 32, {
      [FRUIT_ANIMATION_STATE.IDLE]: new Animation(
        `fruits/${fruit}.png`,
        11,
        50,
        32,
        32,
        true
      ),
      [FRUIT_ANIMATION_STATE.COLLECTED]: new Animation(
        `fruits/Collected.png`,
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

    this.setAnimation(FRUIT_ANIMATION_STATE.COLLECTED);
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