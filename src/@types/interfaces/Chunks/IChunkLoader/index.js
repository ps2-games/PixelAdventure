/**
 * Interface para carregamento de chunks
 * @interface
 */
export default class IChunkLoader {
  /**
   * Carrega o chunk específico.
   * @param {number} chunkX - A posição X do chunk.
   * @param {number} chunkY - A posição Y do chunk.
   * @throws {Error} Lança um erro se não implementado.
   */
  loadChunk(chunkX, chunkY) {
    throw new Error("Method 'loadChunk' must be implemented");
  }

  /**
   * Descarrega o chunk especificado.
   * @param {string} chunkKey - A chave do chunk.
   * @throws {Error} Lança um erro se não implementado.
   */
  unloadChunk(chunkKey) {
    throw new Error("Method 'unloadChunk' must be implemented");
  }
}