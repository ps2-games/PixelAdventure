import { DELTA_TIME } from "./constants.js";

function parallaxToDown(image, speed, deltaTime) {
    if (!image._parallax) {
        image._parallax = {
            positions: [0, -Math.fround(image.height)],
            lastUpdate: Date.now()
        };
    }

    const now = Date.now();
    image._parallax.lastUpdate = now;

    for (let i = 0; i < 2; i++) {
        image._parallax.positions[i] += speed * deltaTime;
        
        if (image._parallax.positions[i] >= Math.fround(image.height)) {
            image._parallax.positions[i] -= Math.fround(2 * image.height);
        }
    }

    image.draw(0, image._parallax.positions[0]);
    image.draw(0, image._parallax.positions[1]);
}
function animationHorizontalSprite(image) {
    const {
        totalFrames,
        fps = 12,
        frameWidth,
        frameHeight,
        loop = true,
        scale = 1,
        startFrame = 0,
        endFrame = totalFrames - 1,
        facingLeft = false,
        onAnimationEnd
    } = image;

    if (image.currentFrame === undefined) image.currentFrame = startFrame;
    if (image.frameTimer === undefined) image.frameTimer = 0;
    if (image.lastUpdate === undefined) image.lastUpdate = Date.now();

    const now = Date.now();
    let deltaTime;
    
    if (image.deltaTime !== undefined) {
        deltaTime = image.deltaTime * 1000;
    } else {
        deltaTime = now - image.lastUpdate;
    }
    
    image.lastUpdate = now;

    const frameTime = 1000 / fps;
    image.frameTimer += deltaTime;

    if (image.frameTimer >= frameTime) {
        const framesToAdvance = Math.floor(image.frameTimer / frameTime);
        image.currentFrame += framesToAdvance;
        image.frameTimer -= framesToAdvance * frameTime;

        if (image.currentFrame > endFrame) {
            if (loop) {
                image.currentFrame = startFrame + ((image.currentFrame - startFrame) % (endFrame - startFrame + 1));
            } else {
                image.currentFrame = endFrame;
                onAnimationEnd?.();
            }
        }
    }

    const frameIndex = image.currentFrame;
    
    image.width = frameWidth * scale;
    image.height = frameHeight * scale;
    
    if (facingLeft) {
        image.startx = (frameIndex + 1) * frameWidth;
        image.endx = frameIndex * frameWidth;
    } else {
        image.startx = frameIndex * frameWidth;
        image.endx = image.startx + frameWidth;
    }
    
    image.starty = 0;
    image.endy = frameHeight;
}
function animateWithEasing(frame, targetProps, progressFunction) {
    if (!frame.start) frame.start = Date.now();
    if (!frame.duration) frame.duration = 2000;
    if (!frame.extraDelay) frame.extraDelay = 800;
    if (!frame.loopEnabled) frame.loopEnabled = false;
    if (!frame.shouldReverse) frame.shouldReverse = false;
    if (frame.isReversed === undefined) frame.isReversed = false;

    if (!frame._deltas) {
        frame._base = {};
        frame._deltas = {};

        for (const k in targetProps) {
            frame._base[k] = frame[k] ?? 0;
            frame._deltas[k] = targetProps[k] - frame._base[k];
        }
    }

    const now = Date.now();
    const elapsed = now - frame.start;
    let t = elapsed / frame.duration;

    if (t >= 1) {
        t = 1;
        if (elapsed >= frame.duration + frame.extraDelay) {
            if (frame.loopEnabled) {
                if (frame.shouldReverse) {
                    frame.isReversed = !frame.isReversed;
                    for (const k in frame._deltas) {
                        frame._deltas[k] *= -1;
                        frame._base[k] += frame._deltas[k];
                    }
                }
                frame.start = Date.now();
                t = 0;
            }
        }
    }

    const p = progressFunction(t);
    for (const k in frame._deltas) {
        frame[k] = frame._base[k] + frame._deltas[k] * p;
    }

    return t >= 1 && !frame.loopEnabled;
}

export {
    parallaxToDown,
    animateWithEasing,
    animationHorizontalSprite
}