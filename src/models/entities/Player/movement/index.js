import TileProperties from "../../../../@types/tile-properties.js";
import TileTypes from "../../../../@types/tile-types.js";
import { TILE_SIZE } from "../../../../core/Scene/constants/index.js";
import { PlayerMovementConstants } from "../constants/movement.js";

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

        this.state = {
            isJumping: false,
            facingDirection: 'RIGHT',
            isGrounded: false,
            affectedByGravity: options.affectedByGravity !== undefined ? options.affectedByGravity : true,
            jumpsRemaining: 2,
            maxJumps: 2,
            isWallSliding: false,
            canMove: true,
        };

        this.callbacks = options.callbacks || {};

        this.tileMap = options.tileMap || [];
        this.entity = options.entity;

        this._collisionCache = {
            nearbyTiles: [],
            hCollision: null,
            vCollision: null
        };

        this._tempPosition = { x: 0, y: 0 };
        this._tempVelocity = { x: 0, y: 0 };

        this.initSpatialGrid();
    }

    initSpatialGrid() {
        const cellSize = TILE_SIZE * 4;
        this.spatialGrid = {};
        this.cellSize = cellSize;

        this._invCellSize = 1 / cellSize;

        const tileMapLength = this.tileMap.length;
        for (let i = 0; i < tileMapLength; i++) {
            const tile = this.tileMap[i];
            const gridX = Math.floorf(tile.x * this._invCellSize);
            const gridY = Math.floorf(tile.y * this._invCellSize);
            const cellKey = `${gridX},${gridY}`;

            if (!this.spatialGrid[cellKey]) {
                this.spatialGrid[cellKey] = [];
            }

            this.spatialGrid[cellKey].push(tile);
        }
    }

    checkWallCollision() {
        if (this.state.isGrounded) {
            if (this.state.isWallSliding) {
                this.state.isWallSliding = false;
                if (this.callbacks.onWallSlideEnd) {
                    this.callbacks.onWallSlideEnd();
                }
            }
            return false;
        }

        const collisionDistance = 5;
        const direction = this.state.facingDirection;

        const testX = direction === 'RIGHT'
            ? this.position.x + this._entityWidth + collisionDistance
            : this.position.x - collisionDistance;

        const testY = this.position.y + (this._entityHeight / 2);

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
                if ((direction === 'RIGHT' && this.velocity.x > 0) ||
                    (direction === 'LEFT' && this.velocity.x < 0)) {
                    wallCollision = true;
                    break;
                }
            }
        }

        const wasWallSliding = this.state.isWallSliding;
        this.state.isWallSliding = wallCollision;

        if (wallCollision && !wasWallSliding && this.callbacks.onWallSlideStart) {
            this.callbacks.onWallSlideStart(this.state.canMove);
        } else if (!wallCollision && wasWallSliding && this.callbacks.onWallSlideEnd) {
            this.callbacks.onWallSlideEnd(this.state.canMove);
        }

        return wallCollision;
    }

    update(deltaTime = 1) {
        if (this.state.affectedByGravity) {
            if (this.velocity.y < this.physics.maxVelocityY) {
                this.velocity.y += this.physics.gravity * deltaTime;
            }
        }

        if (!this.state.canMove) {
            this.velocity.x = 0;
            this.updatePosition(deltaTime);
            return;
        }

        this.checkWallCollision();
        if (this.state.isWallSliding) {
            this.velocity.y = Math.min(this.velocity.y, PlayerMovementConstants.WALL_SLIDE_SPEED);
        }
        this.updatePosition(deltaTime);
        this.checkBoundaryCollisions();
    }

    checkTileCollision(newX, newY, direction) {
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

        return closestTile ? { tile: closestTile, tileProps: closestTileProps } : null;
    }

    getNearbyCollisionTiles(x, y) {
        this._collisionCache.nearbyTiles.length = 0;
        const result = this._collisionCache.nearbyTiles;

        const entityGridX = Math.floorf(x * this._invCellSize);
        const entityGridY = Math.floorf(y * this._invCellSize);

        for (let i = entityGridX - 1; i <= entityGridX + 1; i++) {
            for (let j = entityGridY - 1; j <= entityGridY + 1; j++) {
                const cellKey = `${i},${j}`;
                const tilesInCell = this.spatialGrid[cellKey];

                if (tilesInCell) {
                    const cellLength = tilesInCell.length;
                    for (let k = 0; k < cellLength; k++) {
                        result.push(tilesInCell[k]);
                    }
                }
            }
        }

        return result;
    }

    updatePosition(deltaTime) {
        let newX = this.position.x + this.velocity.x * deltaTime;
        let newY = this.position.y + this.velocity.y * deltaTime;

        if (this.state.canMove) {
            if (this.velocity.y !== 0) {
                const vCollision = this.checkTileCollision(this.position.x, newY, 'vertical');
                this._collisionCache.vCollision = vCollision;

                if (vCollision) {
                    if (vCollision.tileProps.isPlatform) {
                        if (this.velocity.y > 0 && this.position.y + this._entityHeight <= vCollision.tile.y) {
                            newY = vCollision.tile.y - this._entityHeight;
                            this.velocity.y = 0;

                            const justLanded = !this.state.isGrounded;
                            this.state.isGrounded = true;
                            this.state.jumpsRemaining = this.state.maxJumps;

                            if (justLanded && this.callbacks.onLand) {
                                this.callbacks.onLand(this.velocity, this.state.canMove);
                            }
                        }
                    } else if (vCollision.tileProps.collidable) {
                        if (this.velocity.y > 0) {
                            newY = vCollision.tile.y - this._entityHeight;
                            this.velocity.y = 0;

                            const justLanded = !this.state.isGrounded;
                            this.state.isGrounded = true;
                            this.state.jumpsRemaining = this.state.maxJumps;
                            this.state.isWallSliding = false;

                            if (justLanded && this.callbacks.onLand) {
                                this.callbacks.onLand(this.velocity);
                            }
                        } else if (this.velocity.y < 0) {
                            newY = vCollision.tile.y + vCollision.tile.height;
                            this.velocity.y = 0;
                        }
                    }
                } else {
                    this.state.isGrounded = false;
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

                    if (!this.state.isGrounded && !this.state.isWallSliding) {
                        this.state.isWallSliding = true;
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
            this.callbacks.onMove(newX, newY, this.state.canMove);
        }
    }

    checkBoundaryCollisions() {
        const wasGrounded = this.state.isGrounded;
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
            this.position.y = this.constraints.maxY;
            this.velocity.y = 0;
            this.state.isJumping = false;
            this.state.isGrounded = true;
            this.state.jumpsRemaining = this.state.maxJumps;

            if (!wasGrounded && this.callbacks.onLand) {
                this.callbacks.onLand(this.velocity);
            }
        } else if (this.constraints.maxY !== undefined) {
            this.state.isGrounded = false;
        }

        return collided;
    }

    moveRight(multiplier = 1) {
        const prevDirection = this.state.facingDirection;
        this.velocity.x = this.physics.speed * multiplier;
        this.state.facingDirection = 'RIGHT';

        if (prevDirection !== 'RIGHT' && this.callbacks.onDirectionChange) {
            this.callbacks.onDirectionChange('RIGHT', this.state.canMove);
        }
    }

    moveLeft(multiplier = 1) {
        const prevDirection = this.state.facingDirection;
        this.velocity.x = -this.physics.speed * multiplier;
        this.state.facingDirection = 'LEFT';

        if (prevDirection !== 'LEFT' && this.callbacks.onDirectionChange) {
            this.callbacks.onDirectionChange('LEFT', this.state.canMove);
        }
    }

    stopHorizontalMovement() {
        this.velocity.x = 0;
    }

    forcedJump(multiplier = 1) {
        if (!this.state.canMove) {
            return false;
        }

        this.velocity.y = this.physics.jumpStrength * multiplier;
        this.state.isJumping = true;
        this.state.isGrounded = false;
        this.state.isWallSliding = false;

        if (this.callbacks.onJump) {
            this.callbacks.onJump(this.state.canMove);
        }
        this.state.jumpsRemaining = 2;

        return true;
    }

    jump(multiplier = 1) {
        if (!this.state.canMove) {
            return false;
        }

        if (this.state.isGrounded || this.state.jumpsRemaining > 0) {
            this.velocity.y = this.physics.jumpStrength * multiplier;

            this.state.isJumping = true;
            this.state.isGrounded = false;
            this.state.isWallSliding = false;

            if (!this.state.isGrounded && this.state.jumpsRemaining === 1 && this.callbacks.onDoubleJump) {
                this.callbacks.onDoubleJump(this.state.canMove);
            }
            else if (this.callbacks.onJump) {
                this.callbacks.onJump(this.state.canMove);
            }

            this.state.jumpsRemaining--;
            return true;
        }
        else if (this.state.isWallSliding) {
            this.velocity.y = this.physics.jumpStrength * multiplier;
            this.velocity.x = this.physics.speed * (this.state.facingDirection === 'RIGHT' ? -1 : 1);
            this.state.isJumping = true;
            this.state.isGrounded = false;
            this.state.isWallSliding = false;
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