import { ANIM_DATA, PLAYER_ANIMATION } from "./animationData.js";
import { animationHorizontalSprite } from "./animationEngine.js";
import { BUTTONS, PLAYER_MOVEMENT, PLAYERS_PORT, SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants.js";
import InputManager from "./InputManager.js";

export default class Player {
    constructor(options = {}) {
        this.position = { x: options.initialX || 0, y: options.initialY || 0 }
        this.velocity = { x: 0, y: 0 }

        this._bounds = { left: 0, top: 0, right: 0, bottom: 0 };

        this.isLiving = true;
        this.deathRotation = 0;

        this.state = PLAYER_ANIMATION.IDLE
        this.animations = ANIM_DATA.PLAYER
        this.animations[PLAYER_ANIMATION.HIT].onAnimationEnd = () => { };
        this.currentAnimation = this.animations[PLAYER_ANIMATION.IDLE]

        this.jumpsRemaining = 2;

        this.debugColor = Color.new(255, 0, 0, 50);
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
        return this.currentAnimation.facingLeft ? this.position.x + Math.abs(this.currentAnimation.width) : this.position.x;
    }

    applyGravity(deltaTime = 16.67) {
        this.velocity.y += PLAYER_MOVEMENT.DEFAULT_GRAVITY * deltaTime;
    }

    moveRight(multiplier = 1) {
        this.currentAnimation.facingLeft = false;
        this.velocity.x = PLAYER_MOVEMENT.DEFAULT_SPEED * multiplier
    }

    moveLeft(multiplier = 1) {
        this.currentAnimation.facingLeft = true;
        this.velocity.x = -PLAYER_MOVEMENT.DEFAULT_SPEED * multiplier;
    }

    jump(multiplier = 1) {
        if (this.jumpsRemaining === 0) return;
        this.velocity.y = PLAYER_MOVEMENT.DEFAULT_JUMP_STRENGTH * multiplier
        this.jumpsRemaining--;
    }

    die() {
        if (!this.isLiving) return;

        this.isLiving = false;

        const direction = this.currentAnimation.facingLeft ? -1 : 1;
        this.velocity.x = direction * 2;
        this.velocity.y = -4;

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

        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).pressed(BUTTONS.CIRCLE)) {
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

    updatePosition(deltaTime = 16.67) {
        if (this.isInMaxYVelocity()) this.applyGravity(deltaTime);

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
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
        const drawX = this.fixLeftPosition();

        animationHorizontalSprite(this.currentAnimation);
        this.currentAnimation.angle = this.deathRotation;
        this.currentAnimation.draw(drawX, this.position.y);
        this.drawCollisionBox();
    }

    update(deltaTime) {
        if (this.isLiving) {
            this.handleInput();
            this.updatePosition(deltaTime);

            if (this.isGrounded()) this.jumpsRemaining = PLAYER_MOVEMENT.DEFAULT_JUMPS;
        }
        else {
            this.deathRotation += this._deathRotationSpeed * deltaTime;
            this.updatePosition(deltaTime);
        }

        this.updateAnimation();
        this.draw();
    }

    shouldRemove() {
        if (this.isLiving) return false;

        return this.position.y > SCREEN_HEIGHT || Math.abs(this.position.x) > SCREEN_WIDTH;
    }
}