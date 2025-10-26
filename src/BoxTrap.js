import AnimatableEntity from "./AnimatableEntity.js";
import { ANIM_DATA, BOX_TRAP_ANIMATION } from "./animationData.js";

export default class BoxTrap extends AnimatableEntity {
    constructor(x, y, player) {
        super(x, y, 28, 26, ANIM_DATA.BOX_TRAP)
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
        this._bounds.left = this.x + 4;
        this._bounds.top = this.y + 2;
        this._bounds.right = this.x + (this.width - 4);
        this._bounds.bottom = this.y + this.height - 2;

        return this._bounds;
    }

    isPlayerAbove() {
        if (!this.isColliding(this.player)) return false;

        const playerBounds = this.player.getBounds();
        const boxBounds = this.getBounds();
        const velocity = this.player.movementController.velocity;

        const isComingFromAbove =
            playerBounds.bottom >= boxBounds.top &&
            playerBounds.bottom <= boxBounds.top + 10 &&
            velocity.y > 0;

        if (isComingFromAbove) {
            this.player.movementController.forcedJump();
            return true;
        }

        return false;
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

            this.animations[BOX_TRAP_ANIMATION.HIT].onAnimationEnd = () => {
                this.state.isHit = false;
                this.state.isIdle = true;
            };
            this.life--;

            if (this.life <= 0) {
                this.state.isBroken = true;
                this.animations[BOX_TRAP_ANIMATION.BREAK].onAnimationEnd = () => {
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
            this.setAnimation(BOX_TRAP_ANIMATION.BREAK);
            return;
        }

        if (this.state.isHit) {
            this.setAnimation(BOX_TRAP_ANIMATION.HIT);
            return;
        }

        if (this.state.isIdle) {
            this.setAnimation(BOX_TRAP_ANIMATION.IDLE);
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
    }
}