export default class TileMapRenderer {
  constructor(tileMap) {
    this.tileMap = tileMap;
  }

  renderViewport() {
    const currentTileset = this.tileMap.tilesets.get(this.tileMap.currentTilesetKey);
    if (!currentTileset.isReady()) {
      throw new Error("Imagem do tileset não está pronta para renderização");
    }

    const tileSize = currentTileset.tileSize;
    const startX = Math.floor(this.tileMap.viewport.x / tileSize);
    const startY = Math.floor(this.tileMap.viewport.y / tileSize);
    const endX = Math.ceil((this.tileMap.viewport.x + this.tileMap.viewport.width) / tileSize) + 1;
    const endY = Math.ceil((this.tileMap.viewport.y + this.tileMap.viewport.height) / tileSize) + 1;

    this.tileMap.layers.forEach((layer) => {
      for (let row = startY; row < endY; row++) {
        if (!layer[row]) continue;

        for (let col = startX; col < endX; col++) {
          const tileId = layer[row][col];
          if (tileId === 0 || tileId === undefined) continue;

          const drawX = (col * tileSize) - this.tileMap.viewport.x;
          const drawY = (row * tileSize) - this.tileMap.viewport.y;

          currentTileset.renderTile(tileId, drawX, drawY);
        }
      }
    });
  }
}