export default class FruitUtils {
    /**
     * Obtém o tipo de fruta com base no índice, alternando se múltiplos tipos forem fornecidos
     * @param {string|string[]} fruitType - Tipo único ou array de tipos de frutas
     * @param {number} index - Índice da fruta
     * @returns {string} Tipo de fruta
     */
    static #getFruitType(fruitType, index) {
        if (Array.isArray(fruitType)) {
            return fruitType[index % fruitType.length];
        }
        return fruitType;
    }

    /**
     * Gera uma linha horizontal de frutas
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     * @param {number} count - Quantidade de frutas
     * @param {string|string[]} fruitType - Tipo único ou array de tipos de frutas
     * @param {number} tileSize - Distância entre as frutas
     * @returns {Array<{x: number, y: number, type: string}>} Array de frutas
     */
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

    /**
     * Gera uma linha vertical de frutas
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     * @param {number} count - Quantidade de frutas
     * @param {string|string[]} fruitType - Tipo único ou array de tipos de frutas
     * @param {number} tileSize - Distância entre as frutas
     * @returns {Array<{x: number, y: number, type: string}>} Array de frutas
     */
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

    /**
     * Gera um quadrado de frutas
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     * @param {number} size - Tamanho do quadrado (frutas por lado)
     * @param {string|string[]} fruitType - Tipo único ou array de tipos de frutas
     * @param {number} tileSize - Distância entre as frutas
     * @returns {Array<{x: number, y: number, type: string}>} Array de frutas
     */
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

    /**
     * Gera um triângulo de frutas
     * @param {number} x - Posição X inicial (centro da base)
     * @param {number} y - Posição Y inicial (topo do triângulo)
     * @param {number} height - Altura do triângulo (número de linhas)
     * @param {string|string[]} fruitType - Tipo único ou array de tipos de frutas
     * @param {number} tileSize - Distância entre as frutas
     * @returns {Array<{x: number, y: number, type: string}>} Array de frutas
     */
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

    /**
     * Gera um triângulo invertido de frutas
     * @param {number} x - Posição X inicial (centro do topo)
     * @param {number} y - Posição Y inicial (topo do triângulo)
     * @param {number} height - Altura do triângulo (número de linhas)
     * @param {string|string[]} fruitType - Tipo único ou array de tipos de frutas
     * @param {number} tileSize - Distância entre as frutas
     * @returns {Array<{x: number, y: number, type: string}>} Array de frutas
     */
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

    /**
     * Gera um retângulo de frutas
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     * @param {number} width - Largura do retângulo
     * @param {number} height - Altura do retângulo
     * @param {string|string[]} fruitType - Tipo único ou array de tipos de frutas
     * @param {number} tileSize - Distância entre as frutas
     * @returns {Array<{x: number, y: number, type: string}>} Array de frutas
     */
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