export function parallaxToDown(image, parallaxOptions, speed) {
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

export function animationHorizontalSprite(image) {
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
    image.startx = frameIndex * frameWidth;
    image.endx = image.startx + frameWidth;
    image.starty = 0;
    image.endy = frameHeight;
    image.width = Math.abs(frameWidth * scale) * (facingLeft ? -1 : 1);
    image.height = frameHeight * scale;
}

export function animateWithEasing(frame, targetProps, progressFunction) {
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
