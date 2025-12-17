import { DELTA_TIME, PLAYER_MOVEMENT, PLAYERS_PORT, SCREEN_HEIGHT } from "../../shared/constants.js";
import InputManager from "../../shared/input.js";

export default class Movement2D {
    constructor(initialX, initialY) {
        this.position = { x: initialX || 0, y: initialY || 0 }
        this.velocity = { x: 0, y: 0 }
        this.facingLeft = false;
        this.canMove = true;
        this.jumpsRemaining = 2;
        this.deathRotation = 0;
    }

    isFalling = () => this.velocity.y > 0;
    isMoving = () => this.velocity.x !== 0 && this.velocity.y === 0;
    isJumping = () => this.velocity.y < 0 && this.jumpsRemaining > 0;
    isDoubleJumping = () => this.velocity.y < 0 && this.jumpsRemaining === 0;
    isGrounded = () => !this.isJumping() && !this.isFalling() && !this.isDoubleJumping();
    isIdle = () => this.isGrounded() && !this.isMoving();
    isInMaxYVelocity = () => this.velocity.y <= PLAYER_MOVEMENT.MAX_Y_VELOCITY;
    setCanMove = (canMove) => this.canMove = canMove;

    moveRight() {
        this.facingLeft = false;
        this.velocity.x = PLAYER_MOVEMENT.DEFAULT_SPEED * DELTA_TIME
    }

    moveLeft() {
        this.facingLeft = true;
        this.velocity.x = -PLAYER_MOVEMENT.DEFAULT_SPEED * DELTA_TIME;
    }

    applyGravity() {
        const gravity = this.canMove ? PLAYER_MOVEMENT.DEFAULT_GRAVITY : PLAYER_MOVEMENT.DEFAULT_GRAVITY / 32;
        this.velocity.y += gravity * DELTA_TIME;
    }

    jump() {
        if (this.jumpsRemaining === 0) return;

        this.velocity.y = PLAYER_MOVEMENT.DEFAULT_JUMP_STRENGTH
        this.jumpsRemaining--;
    }

    groundClamp(animationFrameHeight) {
        if (this.position.y + animationFrameHeight >= SCREEN_HEIGHT) {
            this.position.y = SCREEN_HEIGHT - animationFrameHeight;
            this.velocity.y = 0;
            this.jumpsRemaining = PLAYER_MOVEMENT.DEFAULT_JUMPS;
        }
    }

    die() {
        if (!this.canMove) return;

        this.canMove = false;

        const direction = this.facingLeft ? 1 : -1;
        this.velocity.x = direction * 2 * DELTA_TIME;
        this.velocity.y = -12 * DELTA_TIME;

        this.deathRotation = 0;
        this._deathRotationSpeed = (Math.random() > 0.5 ? 1 : -1) * 0.05;;
    }

    handleInput() {
        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).pressed(Pads.RIGHT)) this.moveRight();
        else if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).pressed(Pads.LEFT)) this.moveLeft();
        else this.velocity.x = 0;

        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).justPressed(Pads.CROSS)) this.jump();

        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).justPressed(Pads.CIRCLE)) this.die();
    }

    updatePosition() {
        if (this.isInMaxYVelocity()) this.applyGravity();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    update(animationFrameHeight) {
        if (this.canMove) this.handleInput();
        else this.deathRotation += this._deathRotationSpeed * DELTA_TIME;

        this.updatePosition();

        if (this.canMove) this.groundClamp(animationFrameHeight);
    }
}
