export default class AnimatorSystem {
    constructor() { }

    static parallaxToDown(image, parallaxOptions, speed) {
        if (parallaxOptions.backgroundsY[1] === 0) {
            parallaxOptions.backgroundsY[1] = parallaxOptions.screenHeight;
        }

        if (parallaxOptions.lastUpdate === undefined) parallaxOptions.lastUpdate = Date.now();

        const now = Date.now();
        const deltaTime = now - parallaxOptions.lastUpdate;
        parallaxOptions.lastUpdate = now;

        for (let i = 0; i < 2; i++) {
            parallaxOptions.backgroundsY[i] += speed * (deltaTime / 1000);
            if (parallaxOptions.backgroundsY[i] >= parallaxOptions.screenHeight) {
                parallaxOptions.backgroundsY[i] -= 2 * parallaxOptions.screenHeight;
            }
        }

        image.draw(0, parallaxOptions.backgroundsY[0]);
        image.draw(0, parallaxOptions.backgroundsY[1]);
    }

    static animationHorizontalSprite(totalFrames, fps, frameWidth, frameHeight, loop, image, scale = 1) {
        if (image.currentFrame === undefined) image.currentFrame = 0;
        if (image.lastUpdate === undefined) image.lastUpdate = Date.now();
        if (image.frameTimer === undefined) image.frameTimer = 0;

        const now = Date.now();
        const deltaTime = now - image.lastUpdate;
        image.lastUpdate = now;

        const frameTime = 1000 / fps;

        image.frameTimer += deltaTime;

        if (image.frameTimer >= frameTime) {
            const framesToAdvance = Math.floor(image.frameTimer / frameTime);
            image.currentFrame += framesToAdvance;

            image.frameTimer -= framesToAdvance * frameTime;

            if (image.currentFrame >= totalFrames) {
                if (loop) {
                    image.currentFrame = image.currentFrame % totalFrames;
                } else {
                    image.currentFrame = totalFrames - 1;
                }
            }
        }

        image.startx = image.currentFrame * frameWidth;
        image.endx = image.currentFrame * frameWidth + frameWidth;
        image.starty = 0;
        image.endy = frameHeight;
        image.width = frameWidth * scale;
        image.height = frameHeight * scale;
    }

    static animationByColumns(framesPerColumn, totalColumns, fps, frameWidth, frameHeight, loop, image, scale = 1) {
        if (image.currentFrame === undefined) image.currentFrame = 0;
        if (image.lastUpdate === undefined) image.lastUpdate = Date.now();
        if (image.frameTimer === undefined) image.frameTimer = 0;

        const now = Date.now();
        const deltaTime = now - image.lastUpdate;
        image.lastUpdate = now;

        const frameTime = 1000 / fps;
        const totalFrames = framesPerColumn * totalColumns;

        image.frameTimer += deltaTime;

        if (image.frameTimer >= frameTime) {
            const framesToAdvance = Math.floor(image.frameTimer / frameTime);
            image.currentFrame += framesToAdvance;
            image.frameTimer -= framesToAdvance * frameTime;

            if (image.currentFrame >= totalFrames) {
                if (loop) {
                    image.currentFrame = image.currentFrame % totalFrames;
                } else {
                    image.currentFrame = totalFrames - 1;
                }
            }
        }

        const currentColumn = Math.floor(image.currentFrame / framesPerColumn);
        const currentRow = image.currentFrame % framesPerColumn;

        image.startx = currentColumn * frameWidth;
        image.endx = currentColumn * frameWidth + frameWidth;
        image.starty = currentRow * frameHeight;
        image.endy = currentRow * frameHeight + frameHeight;

        image.width = frameWidth * scale;
        image.height = frameHeight * scale;
    }

    static animationByRows(framesPerRow, totalRows, fps, frameWidth, frameHeight, loop, image, scale = 1) {
        if (image.currentFrame === undefined) image.currentFrame = 0;
        if (image.lastUpdate === undefined) image.lastUpdate = Date.now();
        if (image.frameTimer === undefined) image.frameTimer = 0;

        const now = Date.now();
        const deltaTime = now - image.lastUpdate;
        image.lastUpdate = now;

        const frameTime = 1000 / fps;
        const totalFrames = framesPerRow * totalRows;

        image.frameTimer += deltaTime;

        if (image.frameTimer >= frameTime) {
            const framesToAdvance = Math.floor(image.frameTimer / frameTime);
            image.currentFrame += framesToAdvance;
            image.frameTimer -= framesToAdvance * frameTime;

            if (image.currentFrame >= totalFrames) {
                if (loop) {
                    image.currentFrame = image.currentFrame % totalFrames;
                } else {
                    image.currentFrame = totalFrames - 1;
                }
            }
        }

        const currentRow = Math.floor(image.currentFrame / framesPerRow);
        const currentColumn = image.currentFrame % framesPerRow;

        image.startx = currentColumn * frameWidth;
        image.endx = currentColumn * frameWidth + frameWidth;
        image.starty = currentRow * frameHeight;
        image.endy = currentRow * frameHeight + frameHeight;

        image.width = frameWidth * scale;
        image.height = frameHeight * scale;
    }
}