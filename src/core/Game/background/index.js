import { BACKGROUND_SIZE } from "../../Scene/constants/index.js";

export const defaultBackground = {
    tiles: Array.from({ length: 10 }, (_, col) => {
        return Array.from({ length: 9 }, (_, row) => ({
            tileX: col * BACKGROUND_SIZE,
            tileY: row * BACKGROUND_SIZE,
            rowIndex: row,
        }));
    }).flat(),
    image: new Image(`./assets/background/Yellow.png`),
    speed: 0.05,
    offsetY: 0,
    limitY: -64,
    resetY: 512,
    blanketMap: null,
};

export function drawBackgroundTile() {
    if (defaultBackground.tiles && defaultBackground.image) {
        defaultBackground.offsetY -= defaultBackground.speed;

        for (const tile of defaultBackground.tiles) {
            let yPos = tile.tileY + defaultBackground.offsetY;

            if (yPos < defaultBackground.limitY) {
                const overflow = defaultBackground.limitY - yPos;
                yPos = defaultBackground.resetY - overflow;
                tile.tileY = yPos - defaultBackground.offsetY;
            }

            defaultBackground.image.draw(tile.tileX, yPos);
        }
    }
}