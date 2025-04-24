import Entity from "../Entity/index.js";

export default class AnimatableEntity extends Entity {
    constructor(x, y, width, height, animations) {
        super(x, y, width, height);

        this.animations = animations;
        this.currentAnimation = null;
        this.currentFrame = 0;

        this.lastUpdate = Date.now();

        const firstAnimationKey = Object.keys(animations)[0];
        if (firstAnimationKey) {
            this.setAnimation(firstAnimationKey);
        }
    }

    setAnimation(name) {
        if (this.animations[name] && this.currentAnimation !== this.animations[name]) {
            this.currentAnimation = this.animations[name];
            this.currentFrame = 0;
        }
    }

    getCurrentFrame() {
        return this.currentFrame;
    }

    getCurrentAnimation() {
        return this.currentAnimation;
    }

    isAnimationFinished() {
        return (
            !this.currentAnimation.loop &&
            this.currentFrame === this.currentAnimation.totalFrames - 1
        );
    }

    updateAnimation() {

        if (!this.currentAnimation) return;

        const now = Date.now();
        if (now - this.lastUpdate > this.currentAnimation.animationSpeed) {
            this.currentFrame++;

            if (this.currentFrame >= this.currentAnimation.totalFrames) {
                if (this.currentAnimation.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.currentAnimation.totalFrames - 1;

                    if (this.currentAnimation.onAnimationEnd) {
                        this.currentAnimation.onAnimationEnd();
                    }
                }
            }

            this.lastUpdate = now;
        }
    }
}