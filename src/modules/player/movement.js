import { DELTA_TIME, PLAYER_MOVEMENT, PLAYERS_PORT, SCREEN_HEIGHT } from "../../shared/constants.js";
import InputManager from "../../shared/input.js";
import Collision from "../../shared/collision.js";

export default class Movement2D {
    constructor(initialX, initialY) {
        this.position = { x: initialX || 0, y: initialY || 0 }
        this.velocity = { x: 0, y: 0 }
        this.facingLeft = false;
        this.canMove = true;
        this.jumpsRemaining = 2;
        this.deathRotation = 0;
        this.onGround = false;
        this.touchingWall = false;
        this.wallDirection = 0;
    }

    isFalling = () => this.velocity.y > 0;
    isMoving = () => this.velocity.x !== 0 && this.onGround;
    isJumping = () => this.velocity.y < 0 && this.jumpsRemaining > 0;
    isDoubleJumping = () => this.velocity.y < 0 && this.jumpsRemaining === 0;
    isGrounded = () => this.onGround;
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

    wallJump() {
        if (!this.touchingWall || this.onGround) return;

        this.velocity.y = PLAYER_MOVEMENT.DEFAULT_JUMP_STRENGTH * 0.9;
        this.velocity.x = -this.wallDirection * PLAYER_MOVEMENT.DEFAULT_SPEED * DELTA_TIME * 1.5;
        this.jumpsRemaining = PLAYER_MOVEMENT.DEFAULT_JUMPS - 1;
        this.facingLeft = this.wallDirection > 0;
    }

    checkGroundCollision(colliderId, bounds) {
        const groundCheck = Collision.checkArea({
            type: 'rect',
            x: bounds.left + 4,
            y: bounds.bottom,
            w: (bounds.right - bounds.left) - 8,
            h: 4,
            mask: ['ground', 'platform'],
            excludeId: colliderId
        });
        this.onGround = groundCheck.length > 0 && this.velocity.y >= 0;

        if (this.onGround) {
            if (this.velocity.y > 0) {
                const ground = groundCheck[0].collider;
                this.position.y = ground.y - (bounds.bottom - this.position.y);
                this.velocity.y = 0;
            }

            this.jumpsRemaining = PLAYER_MOVEMENT.DEFAULT_JUMPS;
        }

        return this.onGround;
    }

    checkWallCollision(colliderId, bounds) {
        const leftCheck = Collision.checkArea({
            type: 'rect',
            x: bounds.left - 2,
            y: bounds.top + 4,
            w: 2,
            h: (bounds.bottom - bounds.top) - 8,
            mask: ['ground', 'wall', 'platform'],
            excludeId: colliderId
        });
        const rightCheck = Collision.checkArea({
            type: 'rect',
            x: bounds.right,
            y: bounds.top + 4,
            w: 2,
            h: (bounds.bottom - bounds.top) - 8,
            mask: ['ground', 'wall', 'platform'],
            excludeId: colliderId
        });

        this.touchingWall = false;
        this.wallDirection = 0;

        if (leftCheck.length > 0 && this.velocity.x < 0) {
            const wall = leftCheck[0].collider;
            this.position.x = wall.x + wall.w + (this.position.x - bounds.left);
            this.velocity.x = 0;
            this.touchingWall = true;
            this.wallDirection = -1;
        }

        if (rightCheck.length > 0 && this.velocity.x > 0) {
            const wall = rightCheck[0].collider;
            this.position.x = wall.x - (bounds.right - this.position.x);
            this.velocity.x = 0;
            this.touchingWall = true;
            this.wallDirection = 1;
        }

        return this.touchingWall;
    }

    checkCeilingCollision(colliderId, bounds) {
        const ceilingCheck = Collision.checkArea({
            type: 'rect',
            x: bounds.left + 4,
            y: bounds.top - 2,
            w: (bounds.right - bounds.left) - 8,
            h: 2,
            mask: ['ground', 'platform'],
            excludeId: colliderId
        });

        if (ceilingCheck.length > 0 && this.velocity.y < 0) {
            const ceiling = ceilingCheck[0].collider;
            this.position.y = ceiling.y + ceiling.h + (this.position.y - bounds.top);
            this.velocity.y = 0;
            return true;
        }

        return false;
    }

    die() {
        if (!this.canMove) return;

        this.canMove = false;

        const direction = this.facingLeft ? 1 : -1;
        this.velocity.x = direction * 2 * DELTA_TIME;
        this.velocity.y = -12 * DELTA_TIME;

        this.deathRotation = 0;
        this._deathRotationSpeed = (Math.random() > 0.5 ? 1 : -1) * 0.05;
    }

    handleInput() {
        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).pressed(Pads.RIGHT)) {
            this.moveRight();
        } else if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).pressed(Pads.LEFT)) {
            this.moveLeft();
        } else {
            this.velocity.x = 0;
        }

        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).justPressed(Pads.CROSS)) {
            if (this.touchingWall && !this.onGround) {
                this.wallJump();
            } else {
                this.jump();
            }
        }

        if (InputManager.player(PLAYERS_PORT.PLAYER_ONE).justPressed(Pads.CIRCLE)) {
            this.die();
        }
    }

    updatePosition() {
        if (this.isInMaxYVelocity()) {
            this.applyGravity();
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    update(colliderId, bounds) {
        if (this.canMove) {
            this.handleInput();
        } else {
            this.deathRotation += this._deathRotationSpeed * DELTA_TIME;
        }

        this.updatePosition();

        if (this.canMove && colliderId && bounds) {
            this.checkWallCollision(colliderId, bounds);
            this.checkGroundCollision(colliderId, bounds);
            this.checkCeilingCollision(colliderId, bounds);
        }
    }
}