import Animatable from "../../behaviors/Animatable/index.js";
import Collectable from "../../behaviors/Collectable/index.js";
import Animation from "../../components/Animation/index.js";
import Entity from "../Entity/index.js";
import { FruitsAnimationsStates } from "./state/animation.js";

export default class Fruit extends Entity {

  constructor(fruit, xPosition, yPosition) {
    super(xPosition, yPosition, 32, 32);

    this.fruit = fruit;

    this.addBehavior(new Animatable());

    this.initializeAnimations();

    this.addBehavior(new Collectable());
  }

  /**
   * Inicializa as animações da fruta
   */
  initializeAnimations() {
    const animations = {
      [FruitsAnimationsStates.IDLE]: new Animation(
        `Sheets/fruits/${this.fruit}.png`,
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
    };

    this.getBehavior("Animatable").initializeAnimations(animations);
  }

  /**
   * Coleta a fruta
   */
  collect() {
    if (this.getBehavior("Collectable").isCollected) return;
    this.getBehavior("Animatable").setAnimation(FruitsAnimationsStates.COLLECTED);
    this.getBehavior("Collectable").collect();
  }

  update(collector) {
    if (this.getBehavior("Collectable").isCollected) {
      this.getBehavior("Animatable").updateAnimation();
      return;
    }

    if (collector && this.isColliding(collector)) {
      collector.getBehavior("Collector").collect(this);
    }

    this.getBehavior("Animatable").updateAnimation();
  }

  shouldRemove() {
    const collectable = this.getBehavior("Collectable");
    const animatable = this.getBehavior("Animatable");
    return (
      collectable.isCollected &&
      animatable.animationManager.isAnimationFinished()
    );
  }

  /**
   * Renderiza a fruta na tela
   */
  draw() {
    const animatable = this.getBehavior("Animatable");

    const { frameWidth, frameHeight, image } = animatable.getCurrentAnimation();
    const frameX = animatable.animationManager.getCurrentFrame() * frameWidth;

    image.startx = frameX;
    image.starty = 0;
    image.endx = frameX + frameWidth;
    image.endy = frameHeight;
    image.width = frameWidth;
    image.height = frameHeight;

    image.draw(this.x, this.y);
  }

}