import TileProperties from "../../../../@types/tile-properties.js";
import TileTypes from "../../../../@types/tile-types.js";
import { TILE_SIZE } from "../../../../core/Scene/constants/index.js";
import { PlayerMovementConstants } from "../constants/movement.js";

const PLAYER_STATE = {
    IS_JUMPING: 1,
    IS_GROUNDED: 1 << 1,
    IS_WALL_SLIDING: 1 << 2,
    CAN_MOVE: 1 << 3,
    AFFECTED_BY_GRAVITY: 1 << 4,
    FACING_RIGHT: 1 << 5,
};

export default class PlayerMovementController {
    constructor(options = {}) {
        const { width, height } = Screen.getMode();

        this._entityWidth = options.entity?.width || 32;
        this._entityHeight = options.entity?.height || 32;

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

        this._stateFlags = PLAYER_STATE.CAN_MOVE | PLAYER_STATE.FACING_RIGHT;
        if (options.affectedByGravity !== false) {
            this._stateFlags |= PLAYER_STATE.AFFECTED_BY_GRAVITY;
        }

        this.state = {
            get isJumping() { return (this._parent._stateFlags & PLAYER_STATE.IS_JUMPING) !== 0; },
            set isJumping(value) {
                if (value) this._parent._stateFlags |= PLAYER_STATE.IS_JUMPING;
                else this._parent._stateFlags &= ~PLAYER_STATE.IS_JUMPING;
            },

            get facingDirection() { return (this._parent._stateFlags & PLAYER_STATE.FACING_RIGHT) !== 0 ? 'RIGHT' : 'LEFT'; },
            set facingDirection(value) {
                if (value === 'RIGHT') this._parent._stateFlags |= PLAYER_STATE.FACING_RIGHT;
                else this._parent._stateFlags &= ~PLAYER_STATE.FACING_RIGHT;
            },

            get isGrounded() { return (this._parent._stateFlags & PLAYER_STATE.IS_GROUNDED) !== 0; },
            set isGrounded(value) {
                if (value) this._parent._stateFlags |= PLAYER_STATE.IS_GROUNDED;
                else this._parent._stateFlags &= ~PLAYER_STATE.IS_GROUNDED;
            },

            get affectedByGravity() { return (this._parent._stateFlags & PLAYER_STATE.AFFECTED_BY_GRAVITY) !== 0; },
            set affectedByGravity(value) {
                if (value) this._parent._stateFlags |= PLAYER_STATE.AFFECTED_BY_GRAVITY;
                else this._parent._stateFlags &= ~PLAYER_STATE.AFFECTED_BY_GRAVITY;
            },

            jumpsRemaining: 2,
            maxJumps: 2,

            get isWallSliding() { return (this._parent._stateFlags & PLAYER_STATE.IS_WALL_SLIDING) !== 0; },
            set isWallSliding(value) {
                if (value) this._parent._stateFlags |= PLAYER_STATE.IS_WALL_SLIDING;
                else this._parent._stateFlags &= ~PLAYER_STATE.IS_WALL_SLIDING;
            },

            get canMove() { return (this._parent._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0; },
            set canMove(value) {
                if (value) this._parent._stateFlags |= PLAYER_STATE.CAN_MOVE;
                else this._parent._stateFlags &= ~PLAYER_STATE.CAN_MOVE;
            },

            _parent: this
        };

        this.callbacks = options.callbacks || {};

        this.tileMap = options.tileMap || [];
        this.entity = options.entity;

        this._collisionCache = {
            nearbyTiles: [],
            hCollision: null,
            vCollision: null,
            lastGridPos: { x: null, y: null },
            lastNearbyTiles: null,
            tileCollisions: new Map()
        };

        this._tempPosition = { x: 0, y: 0 };
        this._tempVelocity = { x: 0, y: 0 };

        this._positionCacheSize = 5;
        this._positionCache = new Map();

        this.initSpatialGrid();
    }

    initSpatialGrid() {
        const cellSize = TILE_SIZE << 2;
        this.spatialGrid = {};
        this.cellSize = cellSize;

        this._invCellSize = 1 / cellSize;

        const tileMapLength = this.tileMap.length;
        for (let i = 0; i < tileMapLength; i++) {
            const tile = this.tileMap[i];
            const gridX = (tile.x * this._invCellSize) | 0;
            const gridY = (tile.y * this._invCellSize) | 0;
            const cellKey = `${gridX},${gridY}`;

            if (!this.spatialGrid[cellKey]) {
                this.spatialGrid[cellKey] = [];
            }

            this.spatialGrid[cellKey].push(tile);
        }
    }

    checkWallCollision() {

        if ((this._stateFlags & PLAYER_STATE.IS_GROUNDED) !== 0) {
            if ((this._stateFlags & PLAYER_STATE.IS_WALL_SLIDING) !== 0) {
                this._stateFlags &= ~PLAYER_STATE.IS_WALL_SLIDING;
                if (this.callbacks.onWallSlideEnd) {
                    this.callbacks.onWallSlideEnd();
                }
            }
            return false;
        }

        const collisionDistance = 5;

        const facingRight = (this._stateFlags & PLAYER_STATE.FACING_RIGHT) !== 0;

        const testX = facingRight
            ? this.position.x + this._entityWidth + collisionDistance
            : this.position.x - collisionDistance;

        const testY = this.position.y + (this._entityHeight >> 1);

        const nearbyTiles = this.getNearbyCollisionTiles(testX, testY);
        const nearbyTilesLength = nearbyTiles.length;

        let wallCollision = false;

        for (let i = 0; i < nearbyTilesLength; i++) {
            const tile = nearbyTiles[i];
            const tileProps = TileProperties[tile.type] || TileProperties[TileTypes.DECORATION];

            if (!tileProps.collidable || tileProps.isPlatform) continue;

            if (
                testX >= tile.x &&
                testX <= tile.x + tile.width &&
                testY >= tile.y &&
                testY <= tile.y + tile.height
            ) {
                if ((facingRight && this.velocity.x > 0) ||
                    (!facingRight && this.velocity.x < 0)) {
                    wallCollision = true;
                    break;
                }
            }
        }

        const wasWallSliding = (this._stateFlags & PLAYER_STATE.IS_WALL_SLIDING) !== 0;

        if (wallCollision) {
            this._stateFlags |= PLAYER_STATE.IS_WALL_SLIDING;
        } else {
            this._stateFlags &= ~PLAYER_STATE.IS_WALL_SLIDING;
        }

        if (wallCollision && !wasWallSliding && this.callbacks.onWallSlideStart) {
            this.callbacks.onWallSlideStart((this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0);
        } else if (!wallCollision && wasWallSliding && this.callbacks.onWallSlideEnd) {
            this.callbacks.onWallSlideEnd((this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0);
        }

        return wallCollision;
    }

    update(deltaTime = 1) {
        if ((this._stateFlags & PLAYER_STATE.AFFECTED_BY_GRAVITY) !== 0) {
            if (this.velocity.y < this.physics.maxVelocityY) {
                this.velocity.y += this.physics.gravity * deltaTime;
            }
        }

        if ((this._stateFlags & PLAYER_STATE.CAN_MOVE) === 0) {
            this.velocity.x = 0;
            this.updatePosition(deltaTime);
            return;
        }

        this.checkWallCollision();

        if ((this._stateFlags & PLAYER_STATE.IS_WALL_SLIDING) !== 0) {
            this.velocity.y = Math.min(this.velocity.y, PlayerMovementConstants.WALL_SLIDE_SPEED);
        }

        this.updatePosition(deltaTime);
        this.checkBoundaryCollisions();
    }

    checkTileCollision(newX, newY, direction) {
        const cacheKey = `${Math.floor(newX)},${Math.floor(newY)},${direction}`;

        if (this._collisionCache.tileCollisions.has(cacheKey)) {
            return this._collisionCache.tileCollisions.get(cacheKey);
        }

        const entityRight = newX + this._entityWidth;
        const entityBottom = newY + this._entityHeight;

        let closestTile = null;
        let closestTileProps = null;
        let minDistance = Infinity;

        const nearbyTiles = this.getNearbyCollisionTiles(newX, newY);
        const nearbyTilesLength = nearbyTiles.length;

        for (let i = 0; i < nearbyTilesLength; i++) {
            const tile = nearbyTiles[i];
            const tileProps = TileProperties[tile.type] || TileProperties[TileTypes.DECORATION];

            if (!tileProps.collidable) continue;

            if (
                newX < tile.x + tile.width &&
                entityRight > tile.x &&
                newY < tile.y + tile.height &&
                entityBottom > tile.y
            ) {
                if (tileProps.isPlatform) {
                    if (this.velocity.y > 0) {
                        const steps = Math.min(3, Math.ceil(Math.abs(this.velocity.y * 2)));
                        const stepFactor = 1 / steps;
                        const deltaY = newY - this.position.y;

                        for (let j = 0; j <= steps; j++) {
                            const testY = this.position.y + deltaY * (j * stepFactor);
                            const testBottom = testY + this._entityHeight;

                            if (
                                testBottom >= tile.y &&
                                testBottom <= tile.y + 10 &&
                                entityRight > tile.x + 5 &&
                                newX < tile.x + tile.width - 5
                            ) {
                                return { tile, tileProps };
                            }
                        }
                    }
                    continue;
                }

                let distance;
                if (direction === 'horizontal') {
                    distance = (this.velocity.x > 0) ?
                        entityRight - tile.x :
                        tile.x + tile.width - newX;
                } else {
                    distance = (this.velocity.y > 0) ?
                        entityBottom - tile.y :
                        tile.y + tile.height - newY;
                }

                distance = Math.abs(distance);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestTile = tile;
                    closestTileProps = tileProps;
                }
            }
        }

        const result = closestTile ? { tile: closestTile, tileProps: closestTileProps } : null;

        this._collisionCache.tileCollisions.set(cacheKey, result);

        if (this._collisionCache.tileCollisions.size > 20) {
            const firstKey = this._collisionCache.tileCollisions.keys().next().value;
            this._collisionCache.tileCollisions.delete(firstKey);
        }

        return result;
    }

    getNearbyCollisionTiles(x, y) {
        const gridX = (x * this._invCellSize) | 0;
        const gridY = (y * this._invCellSize) | 0;
        const cacheKey = `${gridX},${gridY}`;

        if (this._positionCache.has(cacheKey)) {
            return this._positionCache.get(cacheKey);
        }

        this._collisionCache.nearbyTiles.length = 0;
        const result = this._collisionCache.nearbyTiles;

        for (let i = gridX - 1; i <= gridX + 1; i++) {
            for (let j = gridY - 1; j <= gridY + 1; j++) {
                const cellKey = `${i},${j}`;
                const tilesInCell = this.spatialGrid[cellKey];
                if (tilesInCell) {
                    result.push(...tilesInCell);
                }
            }
        }

        if (this._positionCache.size >= this._positionCacheSize) {
            const firstKey = this._positionCache.keys().next().value;
            this._positionCache.delete(firstKey);
        }

        this._positionCache.set(cacheKey, [...result]);

        return result;
    }

    clearCollisionCache() {
        this._positionCache.clear();
        this._collisionCache.tileCollisions.clear();
        this._collisionCache.lastGridPos = { x: null, y: null };
        this._collisionCache.lastNearbyTiles = null;
        this._collisionCache.hCollision = null;
        this._collisionCache.vCollision = null;
    }

    updatePosition(deltaTime) {
        let newX = this.position.x + this.velocity.x * (deltaTime);
        let newY = this.position.y + this.velocity.y * (deltaTime);

        if (Math.abs(this.velocity.x) > 5 || Math.abs(this.velocity.y) > 5) {
            this.clearCollisionCache();
        }

        if ((this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0) {
            if (this.velocity.y !== 0) {
                const vCollision = this.checkTileCollision(this.position.x, newY, 'vertical');
                this._collisionCache.vCollision = vCollision;

                if (vCollision) {
                    if (vCollision.tileProps.isPlatform) {
                        if (this.velocity.y > 0 && this.position.y + this._entityHeight <= vCollision.tile.y) {
                            newY = vCollision.tile.y - this._entityHeight;
                            this.velocity.y = 0;

                            const justLanded = (this._stateFlags & PLAYER_STATE.IS_GROUNDED) === 0;

                            this._stateFlags |= PLAYER_STATE.IS_GROUNDED;
                            this.state.jumpsRemaining = this.state.maxJumps;

                            if (justLanded && this.callbacks.onLand) {
                                this.callbacks.onLand(this.velocity, (this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0);
                            }
                        }
                    } else if (vCollision.tileProps.collidable) {
                        if (this.velocity.y > 0) {
                            newY = vCollision.tile.y - this._entityHeight;
                            this.velocity.y = 0;

                            const justLanded = (this._stateFlags & PLAYER_STATE.IS_GROUNDED) === 0;

                            this._stateFlags |= PLAYER_STATE.IS_GROUNDED;
                            this._stateFlags &= ~PLAYER_STATE.IS_WALL_SLIDING;
                            this.state.jumpsRemaining = this.state.maxJumps;

                            if (justLanded && this.callbacks.onLand) {
                                this.callbacks.onLand(this.velocity);
                            }
                        } else if (this.velocity.y < 0) {
                            newY = vCollision.tile.y + vCollision.tile.height;
                            this.velocity.y = 0;
                        }
                    }
                } else {
                    this._stateFlags &= ~PLAYER_STATE.IS_GROUNDED;
                }
            }

            if (this.velocity.x !== 0) {
                const hCollision = this.checkTileCollision(newX, this.position.y, 'horizontal');
                this._collisionCache.hCollision = hCollision;

                if (hCollision && hCollision.tileProps.collidable && !hCollision.tileProps.isPlatform) {
                    if (this.velocity.x > 0) {
                        newX = hCollision.tile.x - this._entityWidth;
                    } else if (this.velocity.x < 0) {
                        newX = hCollision.tile.x + hCollision.tile.width;
                    }
                    this.velocity.x = 0;

                    if (((this._stateFlags & PLAYER_STATE.IS_GROUNDED) === 0) &&
                        ((this._stateFlags & PLAYER_STATE.IS_WALL_SLIDING) === 0)) {
                        this._stateFlags |= PLAYER_STATE.IS_WALL_SLIDING;
                        if (this.callbacks.onWallSlideStart) {
                            this.callbacks.onWallSlideStart();
                        }
                    }
                }
            }
        }

        this.position.x = newX;
        this.position.y = newY;

        if (this.callbacks.onMove) {
            this.callbacks.onMove(newX, newY, (this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0);
        }
    }

    checkBoundaryCollisions() {
        const wasGrounded = (this._stateFlags & PLAYER_STATE.IS_GROUNDED) !== 0;
        let collided = false;

        if (this.constraints.minX !== undefined && this.position.x < this.constraints.minX) {
            this.position.x = this.constraints.minX;
            this.velocity.x = 0;
            collided = true;
        }

        if (this.constraints.maxX !== undefined && this.position.x > this.constraints.maxX) {
            this.position.x = this.constraints.maxX;
            this.velocity.x = 0;
            collided = true;
        }

        if (this.constraints.minY !== undefined && this.position.y < this.constraints.minY) {
            this.position.y = this.constraints.minY;
            this.velocity.y = 0;
            collided = true;
        }

        if (this.constraints.maxY !== undefined && this.position.y > this.constraints.maxY) {
            this.position.x = this.constraints.maxX;
            this.velocity.y = 0;

            this._stateFlags &= ~PLAYER_STATE.IS_JUMPING;
            this._stateFlags |= PLAYER_STATE.IS_GROUNDED;
            this.state.jumpsRemaining = this.state.maxJumps;

            if (!wasGrounded && this.callbacks.onLand) {
                this.callbacks.onLand(this.velocity);
            }
        } else if (this.constraints.maxY !== undefined) {
            this._stateFlags &= ~PLAYER_STATE.IS_GROUNDED;
        }

        return collided;
    }

    moveRight(multiplier = 1) {
        const facingRight = (this._stateFlags & PLAYER_STATE.FACING_RIGHT) !== 0;
        this.velocity.x = this.physics.speed * multiplier;

        this._stateFlags |= PLAYER_STATE.FACING_RIGHT;

        if (!facingRight && this.callbacks.onDirectionChange) {
            this.callbacks.onDirectionChange('RIGHT', (this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0);
        }
    }

    moveLeft(multiplier = 1) {
        const facingRight = (this._stateFlags & PLAYER_STATE.FACING_RIGHT) !== 0;
        this.velocity.x = -this.physics.speed * multiplier;

        this._stateFlags &= ~PLAYER_STATE.FACING_RIGHT;

        if (facingRight && this.callbacks.onDirectionChange) {
            this.callbacks.onDirectionChange('LEFT', (this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0);
        }
    }

    stopHorizontalMovement() {
        this.velocity.x = 0;
    }

    forcedJump(multiplier = 1) {
        if ((this._stateFlags & PLAYER_STATE.CAN_MOVE) === 0) {
            return false;
        }

        this.velocity.y = this.physics.jumpStrength * multiplier;

        this._stateFlags |= PLAYER_STATE.IS_JUMPING;
        this._stateFlags &= ~PLAYER_STATE.IS_GROUNDED;
        this._stateFlags &= ~PLAYER_STATE.IS_WALL_SLIDING;

        if (this.callbacks.onJump) {
            this.callbacks.onJump((this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0);
        }
        this.state.jumpsRemaining = 2;

        return true;
    }

    jump(multiplier = 1) {
        if ((this._stateFlags & PLAYER_STATE.CAN_MOVE) === 0) {
            return false;
        }

        if ((this._stateFlags & PLAYER_STATE.IS_GROUNDED) !== 0 || this.state.jumpsRemaining > 0) {
            this.velocity.y = this.physics.jumpStrength * multiplier;

            this._stateFlags |= PLAYER_STATE.IS_JUMPING;
            this._stateFlags &= ~PLAYER_STATE.IS_GROUNDED;
            this._stateFlags &= ~PLAYER_STATE.IS_WALL_SLIDING;

            if ((this._stateFlags & PLAYER_STATE.IS_GROUNDED) === 0 && this.state.jumpsRemaining === 1 && this.callbacks.onDoubleJump) {
                this.callbacks.onDoubleJump((this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0);
            }
            else if (this.callbacks.onJump) {
                this.callbacks.onJump((this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0);
            }

            this.state.jumpsRemaining--;
            return true;
        }

        else if ((this._stateFlags & PLAYER_STATE.IS_WALL_SLIDING) !== 0) {
            this.velocity.y = this.physics.jumpStrength * multiplier;
            this.velocity.x = this.physics.speed * ((this._stateFlags & PLAYER_STATE.FACING_RIGHT) !== 0 ? -1 : 1);

            this._stateFlags |= PLAYER_STATE.IS_JUMPING;
            this._stateFlags &= ~PLAYER_STATE.IS_GROUNDED;
            this._stateFlags &= ~PLAYER_STATE.IS_WALL_SLIDING;
            this.state.jumpsRemaining = this.state.maxJumps;

            if (this.callbacks.onJump) {
                this.callbacks.onJump();
            }
            return true;
        }
        return false;
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
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