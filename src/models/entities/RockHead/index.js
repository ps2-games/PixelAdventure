import TileProperties from "../../../@types/tile-properties.js";
import { TILE_SIZE } from "../../../core/Scene/constants/index.js";
import AnimatableEntity from "../AnimatableEntity/index.js";
import ROCK_HEAD_ANIMATIONS, { RockHeadAnimationState } from "./constants/animation.js";

export default class RockHead extends AnimatableEntity {
    constructor(x, y, player, options) {
        super(x, y, 42, 42, ROCK_HEAD_ANIMATIONS);
        this.x = x;
        this.y = y;
        this.player = player;
        this.isActive = true;

        this.lastBlink = Date.now();

        this.speed = options.speed;
        this.acceleration = options.speed;
        this.maxVelocity = options.maxVelocity;

        this.direction = options.direction;

        const isVertical = this.direction === 'VERTICAL';
        this.state = {
            isMovingUp: isVertical,
            isMovingRight: !isVertical
        };

        if (options.tileMap) {
            this.tileMap = options.tileMap;
        }

        this.velocity = {
            x: 0,
            y: 0
        };

        this._nearbyTilesCache = [];

        this.initSpatialGrid();

        this._setupAnimationCallbacks();
    }

    _setupAnimationCallbacks() {
        const setIdleAnimation = () => {
            this.setAnimation(RockHeadAnimationState.IDLE);
        };

        this.animations[RockHeadAnimationState.BOTTOM_HIT].onAnimationEnd = setIdleAnimation;
        this.animations[RockHeadAnimationState.TOP_HIT].onAnimationEnd = setIdleAnimation;
        this.animations[RockHeadAnimationState.RIGHT_HIT].onAnimationEnd = setIdleAnimation;
        this.animations[RockHeadAnimationState.LEFT_HIT].onAnimationEnd = setIdleAnimation;

        this.animations[RockHeadAnimationState.BLINK].onAnimationEnd = () => {
            setIdleAnimation();
            this.lastBlink = Date.now();
        };
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

    getNearbyCollisionTiles(x, y) {
        const cellSize = this.cellSize;
        const entityGridX = Math.floor(x / cellSize);
        const entityGridY = Math.floor(y / cellSize);

        this._nearbyTilesCache.length = 0;
        let resultLength = 0;

        const startX = entityGridX - 1;
        const endX = entityGridX + 1;
        const startY = entityGridY - 1;
        const endY = entityGridY + 1;

        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                const cellKey = `${i},${j}`;
                const tilesInCell = this.spatialGrid[cellKey];

                if (tilesInCell) {
                    const cellLength = tilesInCell.length;
                    for (let k = 0; k < cellLength; k++) {
                        this._nearbyTilesCache[resultLength++] = tilesInCell[k];
                    }
                }
            }
        }

        return this._nearbyTilesCache;
    }

    checkTileCollision(newX, newY, direction) {
        const entityRight = newX + this.width;
        const entityBottom = newY + this.height;

        let closestTile = null;
        let closestTileProps = null;
        let minDistance = Infinity;

        const nearbyTiles = this.getNearbyCollisionTiles(newX, newY);
        const nearbyTilesLength = nearbyTiles.length;

        const checkHorizontal = direction === 'horizontal';
        const movingRight = this.velocity.x > 0;
        const movingDown = this.velocity.y > 0;

        for (let i = 0; i < nearbyTilesLength; i++) {
            const tile = nearbyTiles[i];
            const tileProps = TileProperties[tile.type];

            if (!tileProps || !tileProps.collidable) continue;

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
                    if (movingDown) {
                        const steps = Math.min(3, Math.ceil(Math.abs(this.velocity.y * 2)));

                        for (let j = 0; j <= steps; j++) {
                            const testY = this.y + (newY - this.y) * (j / steps);
                            const testBottom = testY + this.height;

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
                if (checkHorizontal) {
                    distance = movingRight ?
                        Math.abs(entityRight - tileLeft) :
                        Math.abs(tileRight - newX);
                } else {
                    distance = movingDown ?
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

    updatePosition(deltaTime) {
        const dt = deltaTime || 1;

        let newX = this.x + this.velocity.x * dt;
        let newY = this.y + this.velocity.y * dt;

        if (this.isActive) {
            const isVertical = this.direction === 'VERTICAL';

            if (isVertical && this.velocity.y !== 0) {
                const vCollision = this.checkTileCollision(this.x, newY, 'vertical');

                if (vCollision) {
                    const { tile, tileProps } = vCollision;

                    if (tileProps.isPlatform) {
                        if (this.velocity.y > 0 && this.y + this.height <= tile.y) {
                            newY = tile.y - this.height;
                            this.velocity.y = 0;
                        }
                    } else if (tileProps.collidable) {
                        if (this.velocity.y > 0) {
                            newY = tile.y - this.height;
                            this.velocity.y = 0;
                            this.setAnimation(RockHeadAnimationState.BOTTOM_HIT);
                            this.state.isMovingUp = true;
                        } else if (this.velocity.y < 0) {
                            newY = tile.y + tile.height;
                            this.velocity.y = 0;
                            this.setAnimation(RockHeadAnimationState.TOP_HIT);
                            this.state.isMovingUp = false;
                        }
                    }
                }
            }

            if (!isVertical && this.velocity.x !== 0) {
                const hCollision = this.checkTileCollision(newX, this.y, 'horizontal');

                if (hCollision && hCollision.tileProps.collidable && !hCollision.tileProps.isPlatform) {
                    const { tile, tileProps } = hCollision;

                    if (this.velocity.x > 0) {
                        newX = tile.x - this.width;
                        this.velocity.x = 0;
                        this.setAnimation(RockHeadAnimationState.RIGHT_HIT);
                        this.state.isMovingRight = false;
                    } else if (this.velocity.x < 0) {
                        newX = tile.x + tile.width;
                        this.velocity.x = 0;
                        this.setAnimation(RockHeadAnimationState.LEFT_HIT);
                        this.state.isMovingRight = true;
                    }
                }
            }
        }

        this.x = newX;
        this.y = newY;
    }

    draw() {
        const animation = this.getCurrentAnimation();
        const { frameWidth, frameHeight, image } = animation;
        const frameX = this.getCurrentFrame() * frameWidth;

        image.startx = frameX;
        image.starty = 0;
        image.endx = frameX + frameWidth;
        image.endy = frameHeight;
        image.width = frameWidth;
        image.height = frameHeight;

        image.draw(this.x, this.y);
    }

    moveVertically() {
        const acceleration = this.acceleration * (this.state.isMovingUp ? -1 : 1);
        this.velocity.y = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity.y + acceleration));
    }

    moveHorizontally() {
        const acceleration = this.acceleration * (this.state.isMovingRight ? 1 : -1);
        this.velocity.x = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity.x + acceleration));
    }

    move() {
        if (this.direction === 'HORIZONTAL') {
            this.moveHorizontally();
        } else {
            this.moveVertically();
        }
    }

    handleBlinkAnimation() {
        const now = Date.now();
        const currentAnimation = this.getCurrentAnimation();
        const idleAnimation = this.animations[RockHeadAnimationState.IDLE];

        if (now - this.lastBlink >= 3000 && currentAnimation === idleAnimation) {
            this.setAnimation(RockHeadAnimationState.BLINK);
        }
    }

    update(deltaTime) {
        this.move();
        this.updatePosition(deltaTime);

        if (this.getCurrentAnimation() === this.animations[RockHeadAnimationState.IDLE]) {
            this.handleBlinkAnimation();
        }

        this.draw();
        this.updateAnimation();
    }
}