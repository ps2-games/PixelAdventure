import TileProperties from "../../../../@types/tile-properties.js";
import TileTypes from "../../../../@types/tile-types.js";
import { TILE_SIZE } from "../../../../core/Scene/constants/index.js";
import { PlayerMovementConstants } from "../constants/movement.js";

export default class PlayerMovementController {
    constructor(options = {}) {
        const { width, height } = Screen.getMode()
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
            maxX: width - 32,
            maxY: height - 32,
            minY: options.minY,
        };

        this.state = {
            isJumping: false,
            facingDirection: 'RIGHT',
            isGrounded: false,
            affectedByGravity: options.affectedByGravity !== undefined ? options.affectedByGravity : true,
            jumpsRemaining: 2,
            maxJumps: 2,
            isWallSliding: false
        };

        this.callbacks = {
            onJump: options.onJump,
            onDoubleJump: options.onDoubleJump,
            onLand: options.onLand,
            onDirectionChange: options.onDirectionChange,
            onMove: options.onMove,
            onWallSlideStart: options.onWallSlideStart,
            onWallSlideEnd: options.onWallSlideEnd
        };

        this.tileMap = options.tileMap || [];
        this.entity = options.entity;
        this.initSpatialGrid();
    }

    initSpatialGrid() {
        const cellSize = TILE_SIZE * 4;
        this.spatialGrid = {};
        this.cellSize = cellSize;

        const tileMapLength = this.tileMap.length;
        for (let i = 0; i < tileMapLength; i++) {
            const tile = this.tileMap[i];

            const gridX = Math.floor(tile.x / cellSize);
            const gridY = Math.floor(tile.y / cellSize);
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
        const entityWidth = this.entity.width;
        const entityHeight = this.entity.height;

        const testX = direction === 'RIGHT'
            ? this.position.x + entityWidth + collisionDistance
            : this.position.x - collisionDistance;

        const testY = this.position.y + entityHeight / 2;

        const nearbyTiles = this.getNearbyCollisionTiles(testX, testY);
        const nearbyTilesLength = nearbyTiles.length;

        let wallCollision = false;

        for (let i = 0; i < nearbyTilesLength; i++) {
            const tile = nearbyTiles[i];
            const tileProps = TileProperties[tile.type] || TileProperties[TileTypes.DECORATION];

            if (!tileProps.collidable || tileProps.isPlatform) continue;

            const tileLeft = tile.x;
            const tileRight = tile.x + tile.width;
            const tileTop = tile.y;
            const tileBottom = tile.y + tile.height;

            if (
                testX >= tileLeft &&
                testX <= tileRight &&
                testY >= tileTop &&
                testY <= tileBottom
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
            this.callbacks.onWallSlideStart();
        } else if (!wallCollision && wasWallSliding && this.callbacks.onWallSlideEnd) {
            this.callbacks.onWallSlideEnd();
        }

        return wallCollision;
    }

    update(deltaTime = 1) {
        if (this.state.affectedByGravity) {
            this.applyGravity(deltaTime);
        }

        this.checkWallCollision();

        if (this.state.isWallSliding) {
            this.velocity.y = Math.min(this.velocity.y, PlayerMovementConstants.WALL_SLIDE_SPEED);
        }

        this.updatePosition(deltaTime);
        this.checkBoundaryCollisions();
    }

    checkTileCollision(newX, newY, direction) {
        const entityRight = newX + this.entity.width;
        const entityBottom = newY + this.entity.height;

        let closestTile = null;
        let closestTileProps = null;
        let minDistance = Infinity;

        const nearbyTiles = this.getNearbyCollisionTiles(newX, newY);
        const nearbyTilesLength = nearbyTiles.length;

        for (let i = 0; i < nearbyTilesLength; i++) {
            const tile = nearbyTiles[i];
            const tileProps = TileProperties[tile.type] || TileProperties[TileTypes.DECORATION];

            if (!tileProps.collidable) continue;

            const tileLeft = tile.x;
            const tileRight = tile.x + tile.width;
            const tileTop = tile.y;
            const tileBottom = tile.y + tile.height;

            if (
                newX < tileRight &&
                entityRight > tileLeft &&
                newY < tileBottom &&
                entityBottom > tileTop
            ) {
                if (tileProps.isPlatform) {
                    if (this.velocity.y > 0) {
                        const steps = Math.min(3, Math.ceil(Math.abs(this.velocity.y * 2)));

                        for (let j = 0; j <= steps; j++) {
                            const testY = this.position.y + (newY - this.position.y) * (j / steps);
                            const testBottom = testY + this.entity.height;

                            if (
                                testBottom >= tileTop &&
                                testBottom <= tileTop + 10 &&
                                entityRight > tileLeft + 5 &&
                                newX < tileRight - 5
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
                        Math.abs(entityRight - tileLeft) :
                        Math.abs(tileRight - newX);
                } else {
                    distance = (this.velocity.y > 0) ?
                        Math.abs(entityBottom - tileTop) :
                        Math.abs(tileBottom - newY);
                }

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
        const cellSize = this.cellSize || TILE_SIZE * 4;
        const entityGridX = Math.floor(x / cellSize);
        const entityGridY = Math.floor(y / cellSize);

        const result = [];
        let resultLength = 0;

        for (let i = entityGridX - 1; i <= entityGridX + 1; i++) {
            for (let j = entityGridY - 1; j <= entityGridY + 1; j++) {
                const cellKey = `${i},${j}`;
                const tilesInCell = this.spatialGrid[cellKey];

                if (tilesInCell) {
                    const cellLength = tilesInCell.length;
                    for (let k = 0; k < cellLength; k++) {
                        result[resultLength++] = tilesInCell[k];
                    }
                }
            }
        }

        return result;
    }

    applyGravity(deltaTime) {
        if (this.velocity.y < this.physics.maxVelocityY) {
            this.velocity.y += this.physics.gravity * deltaTime;
        }
    }

    updatePosition(deltaTime) {
        let newX = this.position.x + this.velocity.x * deltaTime;
        let newY = this.position.y + this.velocity.y * deltaTime;

        if (this.velocity.y !== 0) {
            const vCollision = this.checkTileCollision(this.position.x, newY, 'vertical');

            if (vCollision) {
                if (vCollision.tileProps.isPlatform) {
                    if (this.velocity.y > 0 && this.position.y + this.entity.height <= vCollision.tile.y) {
                        newY = vCollision.tile.y - this.entity.height;
                        this.velocity.y = 0;

                        const justLanded = !this.state.isGrounded;
                        this.state.isGrounded = true;
                        this.state.jumpsRemaining = this.state.maxJumps;

                        if (justLanded && this.callbacks.onLand) {
                            this.callbacks.onLand(this.velocity);
                        }
                    }
                } else if (vCollision.tileProps.collidable) {
                    if (this.velocity.y > 0) {
                        newY = vCollision.tile.y - this.entity.height;
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

            if (hCollision && hCollision.tileProps.collidable && !hCollision.tileProps.isPlatform) {
                if (this.velocity.x > 0) {
                    newX = hCollision.tile.x - this.entity.width;
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

        this.position.x = newX;
        this.position.y = newY;

        if (this.callbacks.onMove) {
            this.callbacks.onMove(this.position.x, this.position.y);
        }
    }

    checkBoundaryCollisions() {
        const wasGrounded = this.state.isGrounded;

        if (this.constraints.minX !== undefined && this.position.x < this.constraints.minX) {
            this.position.x = this.constraints.minX;
            this.velocity.x = 0;
        }

        if (this.constraints.maxX !== undefined && this.position.x > this.constraints.maxX) {
            this.position.x = this.constraints.maxX;
            this.velocity.x = 0;
        }

        if (this.constraints.minY !== undefined && this.position.y < this.constraints.minY) {
            this.position.y = this.constraints.minY;
            this.velocity.y = 0;
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
    }

    moveRight(multiplier = 1) {
        const prevDirection = this.state.facingDirection;
        this.velocity.x = this.physics.speed * multiplier;
        this.state.facingDirection = 'RIGHT';

        if (prevDirection !== this.state.facingDirection && this.callbacks.onDirectionChange) {
            this.callbacks.onDirectionChange(this.state.facingDirection);
        }
    }

    moveLeft(multiplier = 1) {
        const prevDirection = this.state.facingDirection;
        this.velocity.x = -this.physics.speed * multiplier;
        this.state.facingDirection = 'LEFT';

        if (prevDirection !== this.state.facingDirection && this.callbacks.onDirectionChange) {
            this.callbacks.onDirectionChange(this.state.facingDirection);
        }
    }

    stopHorizontalMovement() {
        this.velocity.x = 0;
    }

    jump(multiplier = 1) {
        if (this.state.isGrounded || this.state.jumpsRemaining > 0) {
            this.velocity.y = this.physics.jumpStrength * multiplier;
            this.state.isJumping = true;
            this.state.isGrounded = false;
            this.state.isWallSliding = false;

            if (!this.state.isGrounded && this.state.jumpsRemaining === 1 && this.callbacks.onDoubleJump) {
                this.callbacks.onDoubleJump();
            }
            else if (this.callbacks.onJump) {
                this.callbacks.onJump();
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
        return { ...this.position };
    }

    getVelocity() {
        return { ...this.velocity };
    }
}