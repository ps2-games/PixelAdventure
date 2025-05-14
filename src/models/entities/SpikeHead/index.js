import AnimatableEntity from "../AnimatableEntity/index.js";
import SPIKE_HEAD_ANIMATIONS, { SpikeHeadAnimationState } from "./constants/animation.js";

export default class SpikeHead extends AnimatableEntity {
    constructor(x, y, player) {
        super(x, y, 54, 52, SPIKE_HEAD_ANIMATIONS);
        this.x = x;
        this.y = y;
        this.player = player;
        this.isActive = true;

        this.lastBlink = Date.now();
    }

    getBounds() {
        this._bounds.left = this.x + 7;
        this._bounds.top = this.y + 7;
        this._bounds.right = this.x + this.width - 7;
        this._bounds.bottom = this.y + this.height - 7;

        return this._bounds;
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

    handleBlinkAnimation() {
        const now = Date.now();
        if (now - this.lastBlink >= 3000) {
            if (this.getCurrentAnimation() === this.animations[SpikeHeadAnimationState.IDLE]) {
                this.setAnimation(SpikeHeadAnimationState.BLINK);

                this.animations[SpikeHeadAnimationState.BLINK].onAnimationEnd = () => {
                    this.setAnimation(SpikeHeadAnimationState.IDLE);
                    this.lastBlink = Date.now();
                };
            }
        }
    }

    killPlayer() {
        if (this.isColliding(this.player)) {
            this.player.die();
        }
    }

    update() {
        this.handleBlinkAnimation();
        this.killPlayer();
        this.draw();
        this.updateAnimation();
    }
}