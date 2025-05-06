import Entity from "../Entity/index.js";

export default class AnimatableEntity extends Entity {
    constructor(x, y, width, height, animations) {
        super(x, y, width, height);

        this.animations = animations;
        this.currentAnimation = null;
        this.currentFrame = 0;

        this.lastUpdate = Date.now();

        this._lastAnimationName = null;

        const firstAnimationKey = Object.keys(animations)[0];
        if (firstAnimationKey) {
            this.setAnimation(firstAnimationKey);
        }
    }

    setAnimation(name) {
        if (name === this._lastAnimationName) return;

        const animation = this.animations[name];
        if (animation && this.currentAnimation !== animation) {
            this.currentAnimation = animation;
            this.currentFrame = 0;
            this._lastAnimationName = name;
        }
    }

    getCurrentFrame() {
        return this.currentFrame;
    }

    getCurrentAnimation() {
        return this.currentAnimation;
    }

    isAnimationFinished() {
        if (!this.currentAnimation) return false;

        return (
            !this.currentAnimation.loop &&
            this.currentFrame === this.currentAnimation.totalFrames - 1
        );
    }

    updateAnimation() {
        if (!this.currentAnimation) return;

        const now = Date.now();
        const elapsed = now - this.lastUpdate;
        const speed = this.currentAnimation.animationSpeed;

        if (elapsed > speed) {
            const framesToAdvance = Math.floor(elapsed / speed);
            this.currentFrame += framesToAdvance;

            const totalFrames = this.currentAnimation.totalFrames;

            if (this.currentFrame >= totalFrames) {
                if (this.currentAnimation.loop) {
                    this.currentFrame %= totalFrames;
                } else {
                    this.currentFrame = totalFrames - 1;
                    const onEnd = this.currentAnimation.onAnimationEnd;
                    if (onEnd) onEnd();
                }
            }

            this.lastUpdate = now - (elapsed % speed);
        }
    }
}