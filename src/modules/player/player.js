import { PLAYER_ANIMATION, ASSETS_PATH, PLAYER_MOVEMENT, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../shared/constants.js";
import { animationHorizontalSprite } from "../../shared/animation.js";
import Assets from "../../shared/assets.js";
import Movement2D from "./movement.js";

export default class Player {
    constructor(options = {}) {
        this.movement = new Movement2D(options.initialX, options.initialY)
        this._bounds = { left: 0, top: 0, right: 0, bottom: 0 };

        this.state = PLAYER_ANIMATION.IDLE

        this.animations = this._initAnimations(options.character || 0);
        this.currentAnimation = this.animations[PLAYER_ANIMATION.IDLE]

        this.debugColor = Color.new(255, 0, 0, 50);
    }

    _initAnimations(character) {
        return {
            [PLAYER_ANIMATION.IDLE]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Idle.png`, {
                totalFrames: 11,
                fps: 16,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [PLAYER_ANIMATION.RUN]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Run.png`, {
                totalFrames: 12,
                fps: 12,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [PLAYER_ANIMATION.JUMP]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Jump.png`, {
                totalFrames: 1,
                fps: 12,
                frameWidth: 32,
                frameHeight: 32,
                loop: false,
            }),
            [PLAYER_ANIMATION.DOUBLE_JUMP]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Double_Jump.png`, {
                totalFrames: 6,
                fps: 12,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [PLAYER_ANIMATION.FALL]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Fall.png`, {
                totalFrames: 1,
                fps: 12,
                frameWidth: 32,
                frameHeight: 32,
                loop: false,
            }),
            [PLAYER_ANIMATION.WALL_JUMP]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Wall_Jump.png`, {
                totalFrames: 5,
                fps: 12,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [PLAYER_ANIMATION.HIT]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Hit.png`, {
                totalFrames: 7,
                fps: 12,
                frameWidth: 32,
                frameHeight: 32,
                loop: false,
            }),
        }
    }

    getBounds() {
        this._bounds.left = this.position.x;
        this._bounds.top = this.position.y + 6;
        this._bounds.right = this.position.x + 28;
        this._bounds.bottom = this.position.y + this.currentAnimation.frameHeight;

        return this._bounds;
    }

    updateAnimation() {
        if (!this.movement.canMove) {
            this.state = PLAYER_ANIMATION.HIT;
        }
        else if (this.movement.isDoubleJumping()) {
            this.state = PLAYER_ANIMATION.DOUBLE_JUMP;
        }
        else if (this.movement.isJumping()) {
            this.state = PLAYER_ANIMATION.JUMP;
        }
        else if (this.movement.isFalling()) {
            this.state = PLAYER_ANIMATION.FALL;
        }
        else if (this.movement.isMoving()) {
            this.state = PLAYER_ANIMATION.RUN;
        }
        else {
            this.state = PLAYER_ANIMATION.IDLE;
        }

        if (this.currentAnimation !== this.animations[this.state]) {
            this.currentAnimation = this.animations[this.state];
        }
    }

    drawCollisionBox() {
        this.getBounds()

        Draw.quad(
            this._bounds.left, this._bounds.top,
            this._bounds.right, this._bounds.top,
            this._bounds.right, this._bounds.bottom,
            this._bounds.left, this._bounds.bottom,
            this.debugColor
        );
    }

    draw() {
        if (this.shouldRemove()) return;

        animationHorizontalSprite(this.currentAnimation);
        this.currentAnimation.angle = this.movement.deathRotation;
        this.currentAnimation.facingLeft = this.movement.facingLeft
        this.currentAnimation.draw(Math.fround(this.movement.position.x - this.currentAnimation.width / 2), this.movement.position.y);
        // this.drawCollisionBox();
    }

    update() {
        this.movement.update(this.currentAnimation.frameHeight);
        this.updateAnimation();
        this.draw();
    }

    shouldRemove() {
        if (this.isLiving) return false;

        return this.movement.position.y > SCREEN_HEIGHT || Math.abs(this.movement.position.x) > SCREEN_WIDTH;
    }
}