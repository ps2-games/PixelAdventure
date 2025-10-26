import { TILE_PROPERTIES } from "./constants.js";

export default class CollisionDetector {
    constructor(tileMap, entityWidth, entityHeight, spatialGrid, cellSize, callbacks) {
        this.tileMap = tileMap;
        this.entityWidth = entityWidth;
        this.entityHeight = entityHeight;
        this._halfEntityHeight = entityHeight >> 1;
        this.spatialGrid = spatialGrid;
        this.cellSize = cellSize;
        this._invCellSize = 1 / cellSize;
        this.callbacks = callbacks;
        this._collisionCache = {
            nearbyTiles: [],
            hCollision: null,
            vCollision: null,
            lastGridPos: { x: -1, y: -1 },
            tileCollisions: new Map(),
            tempNearbyTiles: []
        };
        this._positionCache = new Map();
        this._positionCacheSize = 8;
    }

    checkWallCollision(position, velocity, stateManager) {
        if (this.#handleGroundedState(stateManager)) {
            return false;
        }

        const { testX, testY } = this.#calculateTestPosition(position, stateManager);
        const wallCollision = this.#detectWallCollision(testX, testY, velocity, stateManager);

        this.#updateWallSlideState(wallCollision, stateManager);

        return wallCollision;
    }

    checkTileCollision(newX, newY, direction, position, velocity) {
        const cacheKey = this.#generateCacheKey(newX, newY, direction);
        const cachedResult = this.#checkCollisionCache(cacheKey);
        if (cachedResult !== undefined) {
            return cachedResult;
        }

        const entityBounds = this.#calculateEntityBounds(newX, newY);
        const result = this.#detectClosestTileCollision(newX, newY, direction, position, velocity, entityBounds);

        this.#storeCollisionResult(cacheKey, result);
        this.#limitCollisionCacheSize();

        return result;
    }

    clearCollisionCache() {
        this._positionCache.clear();
        this._collisionCache.tileCollisions.clear();
        this._collisionCache.lastGridPos.x = -1;
        this._collisionCache.lastGridPos.y = -1;
        this._collisionCache.hCollision = null;
        this._collisionCache.vCollision = null;
    }

    getCollisionCache() {
        return this._collisionCache;
    }

    #getNearbyCollisionTiles(x, y) {
        const gridX = (x * this._invCellSize) | 0;
        const gridY = (y * this._invCellSize) | 0;

        if (this._collisionCache.lastGridPos.x === gridX &&
            this._collisionCache.lastGridPos.y === gridY) {
            return this._collisionCache.nearbyTiles;
        }

        const cacheKey = `${gridX},${gridY}`;

        if (this._positionCache.has(cacheKey)) {
            this._collisionCache.nearbyTiles = this._positionCache.get(cacheKey);
            this._collisionCache.lastGridPos.x = gridX;
            this._collisionCache.lastGridPos.y = gridY;
            return this._collisionCache.nearbyTiles;
        }

        const result = this._collisionCache.tempNearbyTiles;
        result.length = 0;

        for (let i = gridX - 1; i <= gridX + 1; i++) {
            for (let j = gridY - 1; j <= gridY + 1; j++) {
                const cellKey = `${i},${j}`;
                const tilesInCell = this.spatialGrid[cellKey];
                if (tilesInCell) {
                    const cellTileCount = tilesInCell.length;
                    for (let k = 0; k < cellTileCount; k++) {
                        result.push(tilesInCell[k]);
                    }
                }
            }
        }

        this._collisionCache.nearbyTiles = [...result];
        this._collisionCache.lastGridPos.x = gridX;
        this._collisionCache.lastGridPos.y = gridY;

        if (this._positionCache.size >= this._positionCacheSize) {
            const firstKey = this._positionCache.keys().next().value;
            this._positionCache.delete(firstKey);
        }

        this._positionCache.set(cacheKey, this._collisionCache.nearbyTiles);

        return this._collisionCache.nearbyTiles;
    }

    #handleGroundedState(stateManager) {
        if (stateManager.isGrounded) {
            if (stateManager.isWallSliding) {
                stateManager.isWallSliding = false;
                if (this.callbacks.onWallSlideEnd) {
                    this.callbacks.onWallSlideEnd();
                }
            }
            return true;
        }
        return false;
    }

    #calculateTestPosition(position, stateManager) {
        const collisionDistance = 5;
        const facingRight = stateManager.facingDirection === 'RIGHT';
        const testX = facingRight
            ? position.x + this.entityWidth + collisionDistance
            : position.x - collisionDistance;
        const testY = position.y + this._halfEntityHeight;
        return { testX, testY };
    }

    #detectWallCollision(testX, testY, velocity, stateManager) {
        const nearbyTiles = this.#getNearbyCollisionTiles(testX, testY);

        for (const tile of nearbyTiles) {
            const tileProps = TILE_PROPERTIES[tile.type] || TILE_PROPERTIES[TileTypes.DECORATION];
            if (!tileProps.collidable || tileProps.isPlatform) continue;

            if (this.#isEntityOverlappingTile(testX, testY, tile, true)) {
                if (this.#isValidWallCollision(velocity, stateManager)) {
                    return true;
                }
            }
        }
        return false;
    }

    #isEntityOverlappingTile(x, y, tile, isPointCheck = false) {
        if (isPointCheck) {
            return (
                x >= tile.x &&
                x <= tile.x + tile.width &&
                y >= tile.y &&
                y <= tile.y + tile.height
            );
        }
        const entityBounds = {
            right: x + this.entityWidth,
            bottom: y + this.entityHeight
        };
        return (
            x < tile.x + tile.width &&
            entityBounds.right > tile.x &&
            y < tile.y + tile.height &&
            entityBounds.bottom > tile.y
        );
    }

    #isValidWallCollision(velocity, stateManager) {
        const facingRight = stateManager.facingDirection === 'RIGHT';
        return (facingRight && velocity.x > 0) || (!facingRight && velocity.x < 0);
    }

    #updateWallSlideState(wallCollision, stateManager) {
        const wasWallSliding = stateManager.isWallSliding;
        stateManager.isWallSliding = wallCollision;

        if (wallCollision && !wasWallSliding && this.callbacks.onWallSlideStart) {
            this.callbacks.onWallSlideStart(stateManager.canMove);
        } else if (!wallCollision && wasWallSliding && this.callbacks.onWallSlideEnd) {
            this.callbacks.onWallSlideEnd(stateManager.canMove);
        }
    }

    #generateCacheKey(newX, newY, direction) {
        const intX = Math.floor(newX);
        const intY = Math.floor(newY);
        return `${intX},${intY},${direction}`;
    }

    #checkCollisionCache(cacheKey) {
        if (this._collisionCache.tileCollisions.has(cacheKey)) {
            return this._collisionCache.tileCollisions.get(cacheKey);
        }
        return undefined;
    }

    #calculateEntityBounds(newX, newY) {
        return {
            right: newX + this.entityWidth,
            bottom: newY + this.entityHeight
        };
    }

    #detectClosestTileCollision(newX, newY, direction, position, velocity, entityBounds) {
        let closestTile = null;
        let closestTileProps = null;
        let minDistance = Infinity;

        const nearbyTiles = this.#getNearbyCollisionTiles(newX, newY);

        for (const tile of nearbyTiles) {
            const tileProps = TILE_PROPERTIES[tile.type] || TILE_PROPERTIES[TileTypes.DECORATION];
            if (!tileProps.collidable) continue;

            if (this.#isEntityOverlappingTile(newX, newY, tile)) {
                if (tileProps.isPlatform) {
                    const platformCollision = this.#checkPlatformCollision(newX, newY, tile, position, velocity, entityBounds);
                    if (platformCollision) {
                        return platformCollision;
                    }
                    continue;
                }

                const distance = this.#calculateTileDistance(newX, newY, tile, direction, velocity, entityBounds);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestTile = tile;
                    closestTileProps = tileProps;
                }
            }
        }

        return closestTile ? { tile: closestTile, tileProps: closestTileProps } : null;
    }

    #checkPlatformCollision(newX, newY, tile, position, velocity, entityBounds) {
        const tileProps = TILE_PROPERTIES[tile.type] || TILE_PROPERTIES[TileTypes.DECORATION];
        if (velocity.y <= 0) return null;

        const testBottom = newY + this.entityHeight;
        const isLowSpeed = velocity.y < 3;

        if (isLowSpeed) {
            if (
                testBottom >= tile.y &&
                testBottom <= tile.y + 10 &&
                entityBounds.right > tile.x + 5 &&
                newX < tile.x + tile.width - 5
            ) {
                return { tile, tileProps };
            }
        } else {
            const steps = Math.min(3, Math.ceil(Math.abs(velocity.y * 2)));
            const stepFactor = 1 / steps;
            const deltaY = newY - position.y;

            for (let j = 0; j <= steps; j++) {
                const testY = position.y + deltaY * (j * stepFactor);
                const testBottom = testY + this.entityHeight;

                if (
                    testBottom >= tile.y &&
                    testBottom <= tile.y + 10 &&
                    entityBounds.right > tile.x + 5 &&
                    newX < tile.x + tile.width - 5
                ) {
                    return { tile, tileProps };
                }
            }
        }
        return null;
    }

    #calculateTileDistance(newX, newY, tile, direction, velocity, entityBounds) {
        let distance;
        if (direction === 'horizontal') {
            distance = velocity.x > 0 ? entityBounds.right - tile.x : tile.x + tile.width - newX;
        } else {
            distance = velocity.y > 0 ? entityBounds.bottom - tile.y : tile.y + tile.height - newY;
        }
        return Math.abs(distance);
    }

    #storeCollisionResult(cacheKey, result) {
        this._collisionCache.tileCollisions.set(cacheKey, result);
    }

    #limitCollisionCacheSize() {
        if (this._collisionCache.tileCollisions.size > 32) {
            const firstKey = this._collisionCache.tileCollisions.keys().next().value;
            this._collisionCache.tileCollisions.delete(firstKey);
        }
    }
}