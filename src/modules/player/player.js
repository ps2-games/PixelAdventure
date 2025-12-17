import { PLAYER_ANIMATION, ASSETS_PATH, SCREEN_HEIGHT, SCREEN_WIDTH, DELTA_TIME } from "../../shared/constants.js";
import { animationHorizontalSprite } from "../../shared/animation.js";
import Assets from "../../shared/assets.js";
import Movement2D from "./movement.js";
import Collision from "../../shared/collision.js";

export default class Player {
    constructor(options = {}) {
        this.movement = new Movement2D(options.initialX || SCREEN_WIDTH / 2, options.initialY || 100);
        this._bounds = { left: 0, top: 0, right: 0, bottom: 0 };

        this.state = PLAYER_ANIMATION.IDLE;
        this.colliderId = null;

        this.animations = this._initAnimations(options.character || 0);
        this.currentAnimation = this.animations[PLAYER_ANIMATION.IDLE];

        this.debugColor = Color.new(255, 0, 0, 100);

        this._initCollider();
    }

    _initAnimations(character) {
        return {
            [PLAYER_ANIMATION.IDLE]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Idle.png`, {
                totalFrames: 11,
                fps: 2,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [PLAYER_ANIMATION.RUN]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Run.png`, {
                totalFrames: 12,
                fps: 2,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [PLAYER_ANIMATION.JUMP]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Jump.png`, {
                totalFrames: 1,
                fps: 2,
                frameWidth: 32,
                frameHeight: 32,
                loop: false,
            }),
            [PLAYER_ANIMATION.DOUBLE_JUMP]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Double_Jump.png`, {
                totalFrames: 6,
                fps: 2,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [PLAYER_ANIMATION.FALL]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Fall.png`, {
                totalFrames: 1,
                fps: 2,
                frameWidth: 32,
                frameHeight: 32,
                loop: false,
            }),
            [PLAYER_ANIMATION.WALL_JUMP]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Wall_Jump.png`, {
                totalFrames: 5,
                fps: 2,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [PLAYER_ANIMATION.HIT]: Assets.image(`${ASSETS_PATH.Characters}/${character}/Hit.png`, {
                totalFrames: 7,
                fps: 2,
                frameWidth: 32,
                frameHeight: 32,
                loop: false,
            }),
        }
    }

    _initCollider() {
        this.colliderId = Collision.register({
            type: 'rect',
            x: this.movement.position.x,
            y: this.movement.position.y + this.HITBOX_OFFSET_Y,
            w: this.HITBOX_WIDTH,
            h: this.currentAnimation.frameHeight - this.HITBOX_OFFSET_Y,
            layer: 'player',
            mask: ['enemy', 'ground', 'wall', 'platform'],
            tags: ['player', 'damageable'],
            data: { entity: this }
        });
    }

    getBounds() {
        this._bounds.left = this.movement.position.x - 8;
        this._bounds.top = this.movement.position.y + 8;
        this._bounds.right = this.movement.position.x + 8;
        this._bounds.bottom = this.movement.position.y + this.currentAnimation.frameHeight;

        return this._bounds;
    }

    updateAnimation() {
        if (!this.movement.canMove) this.state = PLAYER_ANIMATION.HIT;
        else if (this.movement.isWallSliding()) this.state = PLAYER_ANIMATION.WALL_JUMP;
        else if (this.movement.isDoubleJumping()) this.state = PLAYER_ANIMATION.DOUBLE_JUMP;
        else if (this.movement.isJumping()) this.state = PLAYER_ANIMATION.JUMP;
        else if (this.movement.isFalling()) this.state = PLAYER_ANIMATION.FALL;
        else if (this.movement.isMoving()) this.state = PLAYER_ANIMATION.RUN;
        else this.state = PLAYER_ANIMATION.IDLE;

        if (this.currentAnimation !== this.animations[this.state]) this.currentAnimation = this.animations[this.state];
    }

    updateCollider() {
        if (!this.colliderId) return;

        const bounds = this.getBounds();

        Collision.update(this.colliderId, {
            x: bounds.left,
            y: bounds.top,
            w: this.HITBOX_WIDTH,
            h: bounds.bottom - bounds.top
        });
    }

    drawCollisionBox() {
        const bounds = this.getBounds();

        Draw.quad(
            bounds.left, bounds.top,
            bounds.right, bounds.top,
            bounds.right, bounds.bottom,
            bounds.left, bounds.bottom,
            this.debugColor
        );
    }

    draw() {
        if (this.shouldRemove()) return;

        this.currentAnimation.deltaTime = DELTA_TIME;
        animationHorizontalSprite(this.currentAnimation);
        this.currentAnimation.angle = this.movement.deathRotation;
        this.currentAnimation.facingLeft = this.movement.facingLeft;
        this.currentAnimation.draw(
            Math.fround(this.movement.position.x - this.currentAnimation.width / 2),
            this.movement.position.y
        );

        //this.drawCollisionBox();
    }

    update() {
        const bounds = this.getBounds();
        this.movement.update(this.colliderId, bounds);

        this.updateCollider();
        this.updateAnimation();
        this.draw();
    }

    destroy() {
        if (this.colliderId !== null) {
            Collision.unregister(this.colliderId);
            this.colliderId = null;
        }

        this.animations = null;
        this.currentAnimation = null;
        this.movement = null;
        this.debugColor = null;
    }

    shouldRemove() {
        if (this.movement.canMove) return false;

        return this.movement.position.y > SCREEN_HEIGHT ||
            Math.abs(this.movement.position.x) > SCREEN_WIDTH + 100;
    }
}