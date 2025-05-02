import AnimatableEntity from "../AnimatableEntity/index.js";
import BOX_ANIMATIONS, { BoxAnimationState } from "./constants/animation.js";

export default class BoxTrap extends AnimatableEntity {
    constructor(x, y, player) {
        super(x, y, 28, 26, BOX_ANIMATIONS)
        this.x = x;
        this.y = y;
        this.player = player;
        this.isActive = true;
        this.life = 3;

        this.state = {
            isHit: false,
            isIdle: true,
            isBroken: false,
        }
    }

    getBounds() {
        return {
            left: this.x,
            top: this.y + 8,
            right: this.x + this.width,
            bottom: this.y + this.height
        };
    }

    isPlayerAbove() {
        if (!this.isColliding(this.player)) return false;

        const playerBounds = this.player.getBounds();
        const boxBounds = this.getBounds();

        const isComingFromAbove =
            playerBounds.bottom >= boxBounds.top &&
            this.player.movementController.velocity.y > 0;

        if (isComingFromAbove) {
            this.player.movementController.forcedJump();
        }

        return isComingFromAbove;
    }

    isPlayerBelow() {
        if (!this.isColliding(this.player)) return false;

        const playerBounds = this.player.getBounds();
        const boxBounds = this.getBounds();

        return (
            playerBounds.top <= boxBounds.bottom &&
            this.player.movementController.velocity.y < 0
        );
    }

    hitBox() {
        if (this.state.isHit || this.state.isBroken) {
            return;
        }

        if (this.isPlayerAbove() || this.isPlayerBelow()) {
            this.state.isHit = true;
            this.state.isIdle = false;

            this.animations[BoxAnimationState.HIT].onAnimationEnd = () => {
                this.state.isHit = false;
                this.state.isIdle = true;
            };
            this.life--;

            if (this.life <= 0) {
                this.state.isBroken = true;
                this.animations[BoxAnimationState.BREAK].onAnimationEnd = () => {
                    this.isActive = false;
                };
            }
        }
    }

    shouldRemove() {
        return this.state.canRemoveFromMemory;
    }

    onChangeState() {
        if (this.state.isBroken) {
            this.setAnimation(BoxAnimationState.BREAK);
            return;
        }

        if (this.state.isHit) {
            this.setAnimation(BoxAnimationState.HIT);
            return;
        }

        if (this.state.isIdle) {
            this.setAnimation(BoxAnimationState.IDLE);
            return;
        }
    }

    update() {
        this.hitBox();
        this.onChangeState();
        this.updateAnimation();
        this.draw();
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

        // this.drawCollisionBox();
    }
}