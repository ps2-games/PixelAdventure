import AnimationManager from "../../components/AnimationManager/index.js";

export default class Animatable {
  constructor(animations = null) {
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
}