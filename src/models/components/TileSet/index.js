export default class TileSet {
  /**
   * Construtor do TileSet
   * @param {Object} config - Configurações do tileset
   * @param {string} config.key - Chave única do tileset
   * @param {Image} config.image - Objeto Image contendo a imagem do tileset
   * @param {number} config.tileSize - Tamanho de cada tile (ex: 32)
   * @param {number} config.columns - Número de colunas no tileset
   */
  constructor(config) {
    this.key = config.key;
    this.image = config.image;
    this.tileSize = config.tileSize || 32;
    this.columns = config.columns || Math.floor(this.image.width / this.tileSize);
    
    if (!this.image) {
      throw new Error("Imagem do tileset é obrigatória");
    }
    
    if (this.tileSize <= 0) {
      throw new Error("Tamanho do tile deve ser positivo");
    }
  }

  /**
   * Verifica se a imagem do tileset está pronta para uso
   * @returns {boolean} Status de disponibilidade da imagem
   */
  isReady() {
    return this.image && this.image.ready();
  }

  /**
   * Calcula a posição de origem de um tile específico
   * @param {number} tileId - ID do tile
   * @returns {Object} Coordenadas de origem do tile
   */
  getTileSourceCoordinates(tileId) {
    const sourceX = (tileId % this.columns) * this.tileSize;
    const sourceY = Math.floor(tileId / this.columns) * this.tileSize;
    
    return { sourceX, sourceY };
  }

  /**
   * Renderiza um tile específico
   * @param {number} tileId - ID do tile
   * @param {number} drawX - Posição X para desenhar
   * @param {number} drawY - Posição Y para desenhar
   */
  renderTile(tileId, drawX, drawY) {
    if (!this.isReady()) {
      throw new Error("Imagem do tileset não está pronta para renderização");
    }

    const { sourceX, sourceY } = this.getTileSourceCoordinates(tileId);

    this.image.startx = sourceX;
    this.image.starty = sourceY;
    this.image.endx = sourceX + this.tileSize;
    this.image.endy = sourceY + this.tileSize;
    this.image.width = this.tileSize;
    this.image.height = this.tileSize;

    this.image.draw(drawX, drawY);
  }

  /**
   * Otimiza a imagem do tileset
   */
  optimize() {
    this.image.optimize();
  }
}