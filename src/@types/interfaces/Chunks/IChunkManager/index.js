/**
 * Interface para gerenciamento de chunks
 * @interface
 */
export default class IChunkManager {
  /**
   * Gerencia o carregamento de chunks com base na posição do jogador.
   * @param {number} playerX - A posição X do jogador.
   * @param {number} playerY - A posição Y do jogador.
   * @throws {Error} Lança um erro se não implementado.
   */
  manageChunkLoading(playerX, playerY) {
    throw new Error("Method 'manageChunkLoading' must be implemented");
  }
}