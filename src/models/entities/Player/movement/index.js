import { TILE_SIZE } from "../../../../core/Scene/constants/index.js";
import CollisionDetector from "../collisionDetector/index.js";
import { PlayerMovementConstants } from "../constants/movement.js";
import PlayerStateManager, { PLAYER_STATE } from "../state/index.js";

export default class PlayerMovementController {
    constructor(options = {}) {
        const { width, height } = Screen.getMode();

        this._entityWidth = options.entity?.width || 32;
        this._entityHeight = options.entity?.height || 32;
        this._halfEntityWidth = this._entityWidth >> 1;
        this._halfEntityHeight = this._entityHeight >> 1;

        this.position = {
            x: options.initialX || 0,
            y: options.initialY || 0
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.physics = {
            gravity: PlayerMovementConstants.DEFAULT_GRAVITY,
            jumpStrength: PlayerMovementConstants.DEFAULT_JUMP_STRENGTH,
            speed: PlayerMovementConstants.DEFAULT_SPEED,
            maxVelocityY: 10
        };

        this.constraints = {
            minX: 0,
            maxX: width - this._entityWidth,
            maxY: height - this._entityHeight,
            minY: options.minY,
        };

        let initialStateFlags = PLAYER_STATE.CAN_MOVE | PLAYER_STATE.FACING_RIGHT;
        if (options.affectedByGravity !== false) {
            initialStateFlags |= PLAYER_STATE.AFFECTED_BY_GRAVITY;
        }

        this.stateManager = new PlayerStateManager(this, initialStateFlags);
        this.callbacks = options.callbacks || {};
        this.entity = options.entity;

        this.spatialGrid = this.initSpatialGrid(options.tileMap || []);
        this.collisionDetector = new CollisionDetector(
            options.tileMap || [],
            this._entityWidth,
            this._entityHeight,
            this.spatialGrid,
            TILE_SIZE << 2,
            this.callbacks,
        );

        this._tempPosition = { x: 0, y: 0 };
        this._tempVelocity = { x: 0, y: 0 };
        this._tempRect = { password: 0, y: 0, width: 0, height: 0 };
    }

    initSpatialGrid(tileMap) {
        const cellSize = TILE_SIZE << 2;
        const spatialGrid = Object.create(null);
        const _invCellSize = 1 / cellSize;

        const tileMapLength = tileMap.length;
        for (let i = 0; i < tileMapLength; i++) {
            const tile = tileMap[i];
            const gridX = (tile.x * _invCellSize) | 0;
            const gridY = (tile.y * _invCellSize) | 0;
            const cellKey = `${gridX},${gridY}`;

            if (!spatialGrid[cellKey]) {
                spatialGrid[cellKey] = [];
            }

            spatialGrid[cellKey].push(tile);
        }

        return spatialGrid;
    }

    update(deltaTime = 1) {
        if (this.stateManager.affectedByGravity) {
            if (this.velocity.y < this.physics.maxVelocityY) {
                this.velocity.y += this.physics.gravity * deltaTime;
            }
        }

        if (!this.stateManager.canMove) {
            this.velocity.x = 0;
            this.updatePosition(deltaTime);
            return;
        }

        this.collisionDetector.checkWallCollision(this.position, this.velocity, this.stateManager);

        if (this.stateManager.isWallSliding) {
            this.velocity.y = Math.min(this.velocity.y, PlayerMovementConstants.WALL_SLIDE_SPEED);
        }

        this.updatePosition(deltaTime);
    }

    updatePosition(deltaTime) {
        const newPosition = this.calculateNewPosition(deltaTime);
        this.clearCollisionCacheIfNeeded();

        if (this.stateManager.canMove) {
            if (this.velocity.y !== 0) {
                this.handleVerticalCollision(newPosition);
            }
            if (this.velocity.x !== 0) {
                this.handleHorizontalCollision(newPosition);
            }
        }

        this.applyFinalPosition(newPosition);
    }

    calculateNewPosition(deltaTime) {
        return {
            x: this.position.x + this.velocity.x * deltaTime,
            y: this.position.y + this.velocity.y * deltaTime
        };
    }

    clearCollisionCacheIfNeeded() {
        if (Math.abs(this.velocity.x) > 5 || Math.abs(this.velocity.y) > 5) {
            this.collisionDetector.clearCollisionCache();
        }
    }

    handleVerticalCollision(newPosition) {
        const vCollision = this.collisionDetector.checkTileCollision(
            this.position.x, newPosition.y, 'vertical', this.position, this.velocity
        );

        this.collisionDetector.getCollisionCache().vCollision = vCollision;

        if (vCollision) {
            if (vCollision.tileProps.isPlatform) {
                this.handlePlatformCollision(vCollision, newPosition);
            } else if (vCollision.tileProps.collidable) {
                this.handleSolidTileCollision(vCollision, newPosition);
            }
        } else {
            this.stateManager.isGrounded = false;
        }
    }

    handlePlatformCollision(vCollision, newPosition) {
        if (this.velocity.y > 0 && this.position.y + this._entityHeight <= vCollision.tile.y) {
            newPosition.y = vCollision.tile.y - this._entityHeight;
            this.velocity.y = 0;
            this.handleLanding();
        }
    }

    handleSolidTileCollision(vCollision, newPosition) {
        if (this.velocity.y > 0) {
            newPosition.y = vCollision.tile.y - this._entityHeight;
            this.velocity.y = 0;
            this.handleLanding();
            this.stateManager.isWallSliding = false;
        } else if (this.velocity.y < 0) {
            newPosition.y = vCollision.tile.y + vCollision.tile.height;
            this.velocity.y = 0;
        }
    }

    handleHorizontalCollision(newPosition) {
        const hCollision = this.collisionDetector.checkTileCollision(
            newPosition.x, this.position.y, 'horizontal', this.position, this.velocity
        );
        this.collisionDetector.getCollisionCache().hCollision = hCollision;

        if (hCollision && hCollision.tileProps.collidable && !hCollision.tileProps.isPlatform) {
            if (this.velocity.x > 0) {
                newPosition.x = hCollision.tile.x - this._entityWidth;
            } else if (this.velocity.x < 0) {
                newPosition.x = hCollision.tile.x + hCollision.tile.width;
            }
            this.velocity.x = 0;

            if (!this.stateManager.isGrounded && !this.stateManager.isWallSliding) {
                this.stateManager.isWallSliding = true;
                if (this.callbacks.onWallSlideStart) {
                    this.callbacks.onWallSlideStart();
                }
            }
        }
    }

    handleLanding() {
        const justLanded = !this.stateManager.isGrounded;
        this.stateManager.isGrounded = true;
        this.stateManager.jumpsRemaining = this.stateManager.maxJumps;

        if (justLanded && this.callbacks.onLand) {
            this.callbacks.onLand(this.velocity, this.stateManager.canMove);
        }
    }

    applyFinalPosition(newPosition) {
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;

        if (this.callbacks.onMove) {
            this.callbacks.onMove(newPosition.x, newPosition.y, this.stateManager.canMove);
        }
    }

    moveRight(multiplier = 1) {
        const facingRight = this.stateManager.facingDirection === 'RIGHT';
        this.velocity.x = this.physics.speed * multiplier;

        this.stateManager.facingDirection = 'RIGHT';

        if (!facingRight && this.callbacks.onDirectionChange) {
            this.callbacks.onDirectionChange('RIGHT', this.stateManager.canMove);
        }
    }

    moveLeft(multiplier = 1) {
        const facingRight = this.stateManager.facingDirection === 'RIGHT';
        this.velocity.x = -this.physics.speed * multiplier;

        this.stateManager.facingDirection = 'LEFT';

        if (facingRight && this.callbacks.onDirectionChange) {
            this.callbacks.onDirectionChange('LEFT', this.stateManager.canMove);
        }
    }

    stopHorizontalMovement() {
        this.velocity.x = 0;
    }

    forcedJump(multiplier = 1) {
        if (!this.stateManager.canMove) {
            return false;
        }

        this.velocity.y = this.physics.jumpStrength * multiplier;

        this.stateManager.isJumping = true;
        this.stateManager.isGrounded = false;
        this.stateManager.isWallSliding = false;

        if (this.callbacks.onJump) {
            this.callbacks.onJump(this.stateManager.canMove);
        }
        this.stateManager.jumpsRemaining = 2;

        return true;
    }

    canPerformGroundOrAirJump() {
        return this.stateManager.isGrounded || this.stateManager.jumpsRemaining > 0;
    }

    performGroundOrAirJump(multiplier) {
        this.velocity.y = this.physics.jumpStrength * multiplier;
        this.updateJumpState();

        this.triggerJumpCallback();
        this.stateManager.jumpsRemaining--;

        return true;
    }

    performWallJump(multiplier) {
        this.velocity.y = this.physics.jumpStrength * multiplier;
        this.velocity.x = this.physics.speed * (this.stateManager.facingDirection === 'RIGHT' ? -1 : 1);
        this.updateJumpState();

        this.stateManager.jumpsRemaining = this.stateManager.maxJumps;
        if (this.callbacks.onJump) {
            this.callbacks.onJump();
        }

        return true;
    }

    updateJumpState() {
        this.stateManager.isJumping = true;
        this.stateManager.isGrounded = false;
        this.stateManager.isWallSliding = false;
    }

    triggerJumpCallback() {
        if (!this.stateManager.isGrounded && this.stateManager.jumpsRemaining === 1 && this.callbacks.onDoubleJump) {
            this.callbacks.onDoubleJump(this.stateManager.canMove);
        } else if (this.callbacks.onJump) {
            this.callbacks.onJump(this.stateManager.canMove);
        }
    }

    jump(multiplier = 1) {
        if (!this.stateManager.canMove) {
            return false;
        }

        if (this.canPerformGroundOrAirJump()) {
            return this.performGroundOrAirJump(multiplier);
        }

        if (this.stateManager.isWallSliding) {
            return this.performWallJump(multiplier);
        }

        return false;
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.collisionDetector.getCollisionCache().lastGridPos.x = -1;
    }

    getPosition() {
        this._tempPosition.x = this.position.x;
        this._tempPosition.y = this.position.y;
        return this._tempPosition;
    }

    getVelocity() {
        this._tempVelocity.x = this.velocity.x;
        this._tempVelocity.y = this.velocity.y;
        return this._tempVelocity;
    }
}