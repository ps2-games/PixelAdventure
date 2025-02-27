import AnimationManager from "../../components/AnimationManager/index.js";
import Entity from "../Entity/index.js";

export default class AnimatedEntity extends Entity {
  constructor(x = 0, y = 0, animations = null) {
    super(x, y);
    this.animationManager = animations ? new AnimationManager(animations) : null;
    this.flipX = false;
  }

  initializeAnimations(animations) {
    this.animationManager = new AnimationManager(animations);
  }

  updateAnimation() {
    if (this.animationManager) {
      this.animationManager.updateAnimation();
    }
  }

  getCurrentAnimation() {
    return this.animationManager ? this.animationManager.getCurrentAnimation() : null;
  }

  setAnimation(state) {
    if (this.animationManager) {
      this.animationManager.setAnimation(state);
    }
  }

  update() {
    super.update();
    this.updateAnimation();
  }
}
