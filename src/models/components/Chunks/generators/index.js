import IChunkGenerator from "../../../../@types/interfaces/Chunks/IChunkGenerator/index.js";

/**
 * Implementação padrão de ChunkGenerator.
 * @extends IChunkGenerator
 */
export default class DefaultChunkGenerator extends IChunkGenerator {
  /**
   * @param {Object} tileMap - O mapa de tiles.
   */
  constructor(tileMap) {
    super();
    this.tileMap = tileMap;
  }

  /**
   * Gera um chunk para as coordenadas fornecidas.
   * @param {number} chunkX - A posição X do chunk.
   * @param {number} chunkY - A posição Y do chunk.
   * @returns {Array} O chunk gerado.
   */
  generateChunk(chunkX, chunkY) {
    const chunk = [];
    for (let y = 0; y < this.tileMap.chunkSize; y++) {
      chunk[y] = [];
      for (let x = 0; x < this.tileMap.chunkSize; x++) {
        chunk[y][x] = Math.floor(Math.random() * 10);
      }
    }
    return chunk;
  }
}