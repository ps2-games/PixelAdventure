import IChunkLoader from "../../../../@types/interfaces/Chunks/IChunkLoader/index.js";

/**
 * Implementação padrão de ChunkLoader.
 * @extends IChunkLoader
 */
export default class DefaultChunkLoader extends IChunkLoader {
  /**
   * @param {Object} tileMap - O mapa de tiles.
   */
  constructor(tileMap) {
    super();
    this.tileMap = tileMap;
  }

  /**
   * Carrega o chunk específico.
   * @param {number} chunkX - A posição X do chunk.
   * @param {number} chunkY - A posição Y do chunk.
   */
  loadChunk(chunkX, chunkY) {
    const chunkKey = `${chunkX},${chunkY}`;
    
    if (this.tileMap.loadedChunks.has(chunkKey)) return;

    const chunkData = this.tileMap.chunkGenerator.generateChunk(chunkX, chunkY);
    this.tileMap.layers.forEach((layer) => {
      this.tileMap.mergeChunkToLayer(layer, chunkData, chunkX, chunkY);
    });

    this.tileMap.loadedChunks.add(chunkKey);
  }

  /**
   * Descarrega o chunk especificado.
   * @param {string} chunkKey - A chave do chunk.
   */
  unloadChunk(chunkKey) {
    this.tileMap.loadedChunks.delete(chunkKey);
    this.tileMap.removeChunkFromLayers(chunkKey);
  }
}