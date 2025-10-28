import { PLAYER_ANIMATION } from "../animationData.js";
import { animationHorizontalSprite } from "../animationEngine.js";
import Assets from "../assets.js";
import { ASSETS_PATH, BUTTONS, DELTA_TIME, PLAYER_MOVEMENT, PLAYERS_PORT, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants.js";
import InputManager from "../input.js";

export default class Player {
    constructor(options = {}) {
        this.position = { x: options.initialX || 0, y: options.initialY || 0 }
        this.velocity = { x: 0, y: 0 }

        this._bounds = { left: 0, top: 0, right: 0, bottom: 0 };

        this.isLiving = true;
        this.deathRotation = 0;
        this.facingLeft = false;

        this.state = PLAYER_ANIMATION.IDLE

        this.animations = this.initAnimations(options.character || 0);
        this.currentAnimation = this.animations[PLAYER_ANIMATION.IDLE]

        this.jumpsRemaining = 2;

        this.debugColor = Color.new(255, 0, 0, 50);
    }

    initAnimations(character) {
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

    isFalling() {
        return this.velocity.y > 0;
    }

    isMoving() {
        return this.velocity.x !== 0;
    }

    isJumping() {
        return this.velocity.y < 0 && this.jumpsRemaining > 0;
    }

    isDoubleJumping() {
        return this.velocity.y < 0 && this.jumpsRemaining === 0;
    }

    isGrounded() {
        return !this.isJumping() && !this.isFalling() && !this.isDoubleJumping();
    }

    isIdle() {
        return this.isGrounded() && !this.isMoving();
    }

    isInMaxYVelocity() {
        return this.velocity.y < PLAYER_MOVEMENT.MAX_Y_VELOCITY
    }

    fixLeftPosition() {
        return this.facingLeft ? this.position.x + Math.abs(this.currentAnimation.width) : this.position.x;
    }

    applyGravity() {
        const gravity = this.isLiving ? PLAYER_MOVEMENT.DEFAULT_GRAVITY : PLAYER_MOVEMENT.DEFAULT_GRAVITY / 32;
        this.velocity.y += gravity * DELTA_TIME;
    }

    moveRight() {
        this.facingLeft = false;
        this.velocity.x = PLAYER_MOVEMENT.DEFAULT_SPEED * DELTA_TIME
    }

    moveLeft() {
        this.facingLeft = true;
        this.velocity.x = -PLAYER_MOVEMENT.DEFAULT_SPEED * DELTA_TIME;
    }

    jump() {
        if (this.jumpsRemaining === 0) return;
        this.velocity.y = PLAYER_MOVEMENT.DEFAULT_JUMP_STRENGTH
        this.jumpsRemaining--;
    }

    die() {
        if (!this.isLiving) return;

        this.isLiving = false;

        const direction = this.facingLeft ? 1 : -1;
        this.velocity.x = direction * 2 * DELTA_TIME;
        this.velocity.y = -12 * DELTA_TIME;

        this.deathRotation = 0;
        const rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * 0.05;

        this._deathRotationSpeed = rotationSpeed;
    }

    handleInput() {
        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).pressed(BUTTONS.RIGHT)) {
            this.moveRight();
        }
        else if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).pressed(BUTTONS.LEFT)) {
            this.moveLeft();
        }
        else {
            this.velocity.x = 0;
        }

        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).justPressed(BUTTONS.CROSS)) {
            this.jump();
        }

        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).justPressed(BUTTONS.CIRCLE)) {
            this.die();
        }
    }

    updateAnimation() {
        if (!this.isLiving) {
            this.state = PLAYER_ANIMATION.HIT;
        }
        else if (this.isDoubleJumping()) {
            this.state = PLAYER_ANIMATION.DOUBLE_JUMP;
        }
        else if (this.isJumping()) {
            this.state = PLAYER_ANIMATION.JUMP;
        }
        else if (this.isFalling()) {
            this.state = PLAYER_ANIMATION.FALL;
        }
        else if (this.isMoving()) {
            this.state = PLAYER_ANIMATION.RUN;
        }
        else {
            this.state = PLAYER_ANIMATION.IDLE;
        }

        if (this.currentAnimation !== this.animations[this.state]) {
            this.currentAnimation = this.animations[this.state];
        }
    }

    updatePosition() {
        if (this.isInMaxYVelocity()) this.applyGravity();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
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

        const drawX = this.fixLeftPosition();

        animationHorizontalSprite(this.currentAnimation);
        this.currentAnimation.angle = this.deathRotation;
        this.currentAnimation.facingLeft = this.facingLeft
        this.currentAnimation.draw(drawX, this.position.y);
        // this.drawCollisionBox();
    }

    groundClamp() {
        if (this.isLiving && this.position.y + this.currentAnimation.frameHeight >= SCREEN_HEIGHT) {
            this.position.y = SCREEN_HEIGHT - this.currentAnimation.frameHeight;
            this.velocity.y = 0;
            this.jumpsRemaining = PLAYER_MOVEMENT.DEFAULT_JUMPS;
        }
    }

    update() {
        if (this.isLiving) {
            this.handleInput();
            this.updatePosition();
            this.groundClamp();
            if (this.isGrounded()) this.jumpsRemaining = PLAYER_MOVEMENT.DEFAULT_JUMPS;
        }
        else {
            this.deathRotation += this._deathRotationSpeed * DELTA_TIME;
            this.updatePosition();
        }

        this.updateAnimation();
        this.draw();
    }

    shouldRemove() {
        if (this.isLiving) return false;

        return this.position.y > SCREEN_HEIGHT || Math.abs(this.position.x) > SCREEN_WIDTH;
    }
}