const imageCache = new Map();
const soundCache = new Map();
const fontCache = new Map();

export default class Assets {
    static image(path, animConfig = {}) {
        if (imageCache.has(path)) return imageCache.get(path).asset;
        const img = new Image(path);

        if (animConfig && Object.keys(animConfig).length > 0) {
            Object.assign(img, animConfig);
        }

        img.lock();
        imageCache.set(path, { asset: img, ref: 1 });
        return img;
    }

    static sound(path) {
        if (soundCache.has(path)) {
            ++soundCache.get(path).ref;
            return soundCache.get(path).asset;
        }

        const ext = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        let asset;

        if (ext === 'adp') {
            asset = Sound.Sfx(path);
        } else if (ext === 'ogg' || ext === 'wav') {
            asset = Sound.Stream(path);
        } else {
            throw new Error(`[Assets] Unknown sound extension: ${ext} (${path})`);
        }

        soundCache.set(path, { asset, ref: 1 });
        return asset;
    }

    static font(path) {
        if (fontCache.has(path)) {
            ++fontCache.get(path).ref;
            return fontCache.get(path).asset;
        }
        const fnt = new Font(path);
        fontCache.set(path, { asset: fnt, ref: 1 });
        return fnt;
    }

    static free(path) {
        [imageCache, soundCache].forEach(cache => {
            const entry = cache.get(path);
            if (entry && --entry.ref <= 0) {
                entry.asset.free();
                cache.delete(path);
            }
        });
    }

    static freePattern(regex) {
        [...imageCache.keys(), ...soundCache.keys()]
            .forEach(k => { if (regex.test(k)) Assets.free(k); });
    }

    static stats() {
        return {
            images: imageCache.size,
            sounds: soundCache.size,
            fonts: fontCache.size
        };
    }
}