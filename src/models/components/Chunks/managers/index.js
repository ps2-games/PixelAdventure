import IChunkManager from "../../../../@types/interfaces/Chunks/IChunkManager/index.js";

/**
 * Implementação padrão de ChunkManager.
 * @extends IChunkManager
 */
export default class DefaultChunkManager extends IChunkManager {
  /**
   * @param {Object} tileMap - O mapa de tiles.
   */
  constructor(tileMap) {
    super();
    this.tileMap = tileMap;
  }

  /**
   * Gerencia o carregamento de chunks com base na posição do jogador.
   * @param {number} playerX - A posição X do jogador.
   * @param {number} playerY - A posição Y do jogador.
   */
  manageChunkLoading(playerX, playerY) {
    if (!this.tileMap) {
      throw new Error("TileMap não foi inicializado");
    }

    const tilesets = this.tileMap.tilesets;

    const currentTilesetKey = this.tileMap.currentTilesetKey;

    const currentTileset = tilesets.get(currentTilesetKey);

    if (!currentTileset) {
      throw new Error(`Tileset não encontrado para a chave: ${currentTilesetKey}`);
    }

    const tileSize = currentTileset.tileSize;
    const chunkSize = this.tileMap.chunkSize;
    const chunkPixelSize = chunkSize * tileSize;

    const playerChunkX = Math.floor(playerX / chunkPixelSize);
    const playerChunkY = Math.floor(playerY / chunkPixelSize);
    const activeChunkRadius = this.tileMap.chunkHysteresis || 2;

    for (let dy = -activeChunkRadius; dy <= activeChunkRadius; dy++) {
      for (let dx = -activeChunkRadius; dx <= activeChunkRadius; dx++) {
        const chunkX = playerChunkX + dx;
        const chunkY = playerChunkY + dy;
        const chunkKey = `${chunkX},${chunkY}`;

        if (!this.tileMap.loadedChunks.has(chunkKey)) {
          this.tileMap.chunkLoader.loadChunk(chunkX, chunkY);
        }

        this.tileMap.activeChunks.add(chunkKey);
      }
    }

    this.optimizedChunkUnloading(playerChunkX, playerChunkY);
  }

  /**
   * Descarrega chunks que não estão mais ativos.
   * @param {number} playerChunkX - A posição X do jogador no chunk.
   * @param {number} playerChunkY - A posição Y do jogador no chunk.
   */
  optimizedChunkUnloading(playerChunkX, playerChunkY) {
    const chunksToUnload = [];

    this.tileMap.loadedChunks.forEach((chunkKey) => {
      if (!this.tileMap.activeChunks.has(chunkKey)) {
        const [chunkX, chunkY] = chunkKey.split(",").map(Number);
        const distanceFromPlayer = Math.max(
          Math.abs(chunkX - playerChunkX),
          Math.abs(chunkY - playerChunkY)
        );

        if (distanceFromPlayer > this.tileMap.chunkHysteresis + 1) {
          chunksToUnload.push(chunkKey);
        }
      }
    });

    chunksToUnload.forEach((chunkKey) => {
      if (!this.tileMap.chunkUnloadTimers.has(chunkKey)) {
        const timer = setTimeout(() => {
          this.tileMap.chunkLoader.unloadChunk(chunkKey);
          this.tileMap.chunkUnloadTimers.delete(chunkKey);
        }, this.tileMap.chunkUnloadDelay);
    
        this.tileMap.chunkUnloadTimers.set(chunkKey, timer);
      }
    });

    this.tileMap.activeChunks.clear();
  }
}
