import Assets from "../assets.js";
import { ASSETS_PATH, SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants.js";

export default class Transition {
    constructor() {
        this.transitionImage = Assets.image(`${ASSETS_PATH.VFX}/transition.png`);

        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionSpeed = Math.fround(0.05);
        this.columnWidth = 44;

        this.totalColumns = Math.ceil(SCREEN_WIDTH / this.columnWidth);

        this.onTransitionComplete = null;
        this.targetScreen = null;
        this.currentScreen = null;

        this.transitionPhase = 'fadeOut';
        this.tileWidth = 44;
        this.tileHeight = 44;
        this.tilesY = Math.ceil(SCREEN_HEIGHT / this.tileHeight);

        this.maxScale = 3;
        this.minScale = Math.fround(0.3);
    }

    startTransition(fromScreen, toScreen, callback = null) {
        if (this.isTransitioning) return false;

        this.currentScreen = fromScreen;
        this.targetScreen = toScreen;
        this.onTransitionComplete = callback;
        this.isTransitioning = true;
        this.transitionProgress = 0;
        this.transitionPhase = 'fadeOut';

        return true;
    }

    update() {
        if (!this.isTransitioning) return;

        this.transitionProgress = Math.min(1, this.transitionProgress + this.transitionSpeed);

        if (this.transitionPhase === 'fadeOut' && this.transitionProgress >= 0.5) {
            this.transitionPhase = 'fadeIn';
        }

        if (this.transitionProgress === 1) {
            this._completeTransition();
        }
    }

    render() {
        if (!this.isTransitioning) return;

        if (this.transitionPhase === 'fadeOut') {
            if (this.currentScreen) {
                this.currentScreen.render();
            }
            const phaseProgress = Math.min(1, this.transitionProgress * 2);

            this._renderTransitionEffect(phaseProgress, 'fadeOut');
        }
        else if (this.transitionPhase === 'fadeIn') {
            if (this.targetScreen) {
                this.targetScreen.render();
            }

            const phaseProgress = Math.fround(Math.min(1, (this.transitionProgress - 0.5) * 2));

            this._renderTransitionEffect(phaseProgress, 'fadeIn');
        }
    }

    _renderTransitionEffect(phaseProgress, phase) {
        for (let col = 0; col < this.totalColumns; col++) {
            const columnX = col * this.columnWidth;

            const columnRelativePosition = col / Math.max(1, this.totalColumns - 1);
            let columnProgress = 0;

            if (phase === 'fadeOut') {
                const adjustedProgress = Math.fround(Math.max(0, phaseProgress * 1.5 - columnRelativePosition * 0.5));
                columnProgress = Math.min(1, adjustedProgress);
            } else {
                const adjustedProgress = Math.fround(Math.max(0, phaseProgress * 1.5 - columnRelativePosition * 0.5));
                columnProgress = Math.max(0, 1 - adjustedProgress);
            }

            if (columnProgress <= 0) continue;

            const easedProgress = this._easeInOutCubic(columnProgress);

            let scale;
            if (phase === 'fadeOut') {
                scale = this.minScale + (this.maxScale - this.minScale) * easedProgress;
            } else {
                scale = this.minScale + (this.maxScale - this.minScale) * easedProgress;
            }
            this._renderColumn(columnX, scale, easedProgress);
        }
    }

    _easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    _renderColumn(columnX, scale, columnProgress) {
        const columnWidth = Math.min(this.columnWidth, SCREEN_WIDTH - columnX);

        for (let tileY = 0; tileY < this.tilesY; tileY++) {
            const y = tileY * this.tileHeight;
            const remainingHeight = Math.min(this.tileHeight, SCREEN_HEIGHT - y);

            const tilesInColumn = Math.ceil(columnWidth / this.tileWidth);

            for (let tileIdx = 0; tileIdx < tilesInColumn; tileIdx++) {
                const tileX = columnX + (tileIdx * this.tileWidth);

                if (tileX >= columnX + columnWidth) break;

                const remainingWidth = Math.min(this.tileWidth, (columnX + columnWidth) - tileX);

                this._renderTile(tileX, y, remainingWidth, remainingHeight, scale, columnProgress);
            }
        }
    }

    _renderTile(x, y, width, height, scale, progress) {
        if (progress <= 0.01) return;

        const scaledWidth = this.tileWidth * scale;
        const scaledHeight = this.tileHeight * scale;

        const centerX = x + this.tileWidth / 2;
        const centerY = y + this.tileHeight / 2;
        const drawX = centerX - scaledWidth / 2;
        const drawY = centerY - scaledHeight / 2;

        if (width < this.tileWidth || height < this.tileHeight) {
            const widthRatio = Math.min(1, width / this.tileWidth);
            const heightRatio = Math.min(1, height / this.tileHeight);

            this.transitionImage.startx = 0;
            this.transitionImage.endx = this.tileWidth * widthRatio;
            this.transitionImage.starty = 0;
            this.transitionImage.endy = this.tileHeight * heightRatio;
            this.transitionImage.width = scaledWidth * widthRatio;
            this.transitionImage.height = scaledHeight * heightRatio;
        } else {
            this.transitionImage.startx = 0;
            this.transitionImage.endx = this.tileWidth;
            this.transitionImage.starty = 0;
            this.transitionImage.endy = this.tileHeight;
            this.transitionImage.width = scaledWidth;
            this.transitionImage.height = scaledHeight;
        }

        this.transitionImage.draw(drawX, drawY);
    }

    _completeTransition() {
        this.isTransitioning = false;
        this.transitionPhase = 'fadeOut';

        if (this.onTransitionComplete) {
            this.onTransitionComplete();
        }

        this.currentScreen = null;
        this.targetScreen = null;
        this.onTransitionComplete = null;
    }

    isInTransition() {
        return this.isTransitioning;
    }

    cancelTransition() {
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionPhase = 'fadeOut';
        this.currentScreen = null;
        this.targetScreen = null;
        this.onTransitionComplete = null;
    }

    setTransitionSpeed(speed) {
        this.transitionSpeed = Math.fround(Math.max(0.001, Math.min(1, speed)));
    }

    setTransitionQuality(width) {
        this.columnWidth = Math.max(1, width);
        this.totalColumns = Math.ceil(SCREEN_WIDTH / this.columnWidth);
    }

    setScaleRange(minScale, maxScale) {
        this.minScale = Math.fround(Math.max(0.1, minScale));
        this.maxScale = Math.max(this.minScale, maxScale);
    }

    getScaleRange() {
        return { min: this.minScale, max: this.maxScale };
    }
}