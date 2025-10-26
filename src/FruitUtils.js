export default class FruitUtils {

    static #getFruitType(fruitType, index) {
        if (Array.isArray(fruitType)) {
            return fruitType[index % fruitType.length];
        }
        return fruitType;
    }

    static drawHorizontalLine(x, y, count, fruitType, tileSize) {
        const fruits = [];
        for (let i = 0; i < count; i++) {
            fruits.push({
                x: x + i * tileSize,
                y,
                type: this.#getFruitType(fruitType, i)
            });
        }
        return fruits;
    }

    static drawVerticalLine(x, y, count, fruitType, tileSize) {
        const fruits = [];
        for (let i = 0; i < count; i++) {
            fruits.push({
                x,
                y: y - i * tileSize,
                type: this.#getFruitType(fruitType, i)
            });
        }
        return fruits;
    }

    static drawSquare(x, y, size, fruitType, tileSize) {
        const fruits = [];
        let index = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                fruits.push({
                    x: x + col * tileSize,
                    y: y + row * tileSize,
                    type: this.#getFruitType(fruitType, index++)
                });
            }
        }
        return fruits;
    }

    static drawTriangle(x, y, height, fruitType, tileSize) {
        const fruits = [];
        let index = 0;

        for (let row = height - 1; row >= 0; row--) {
            const fruitsInRow = row + 1;
            const startX = x - (row * tileSize) / 2;

            for (let col = 0; col < fruitsInRow; col++) {
                fruits.push({
                    x: startX + col * tileSize,
                    y: y - (height - 1 - row) * tileSize,
                    type: this.#getFruitType(fruitType, index++)
                });
            }
        }

        return fruits;
    }

    static drawInvertedTriangle(x, y, height, fruitType, tileSize) {
        const fruits = [];
        let index = 0;
        for (let row = 0; row < height; row++) {
            const fruitsInRow = height - row;
            const startX = x - Math.floor((height - row - 1) / 2) * tileSize;

            for (let col = 0; col < fruitsInRow; col++) {
                fruits.push({
                    x: startX + col * tileSize,
                    y: y + row * tileSize,
                    type: this.#getFruitType(fruitType, index++)
                });
            }
        }
        return fruits;
    }

    static drawRectangle(x, y, width, height, fruitType, tileSize) {
        const fruits = [];
        let index = 0;
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                fruits.push({
                    x: x + col * tileSize,
                    y: y + row * tileSize,
                    type: this.#getFruitType(fruitType, index++)
                });
            }
        }
        return fruits;
    }
}