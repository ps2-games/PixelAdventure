/**
 * Interface para geração de chunks
 * @interface
 */
export default class IChunkGenerator {
  /**
   * Gera um chunk para as coordenadas fornecidas.
   * @param {number} chunkX - A posição X do chunk.
   * @param {number} chunkY - A posição Y do chunk.
   * @throws {Error} Lança um erro se não implementado.
   */
  generateChunk(chunkX, chunkY) {
    throw new Error("Method 'generateChunk' must be implemented");
  }
}