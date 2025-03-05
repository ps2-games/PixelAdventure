import DefaultChunkGenerator from "../Chunks/generators/index.js";
import DefaultChunkLoader from "../Chunks/loaders/index.js";
import DefaultChunkManager from "../Chunks/managers/index.js";
import TileMapRenderer from "./Renderer/index.js";
import TileMapValidator from "./Validator/index.js";
import TileMapViewport from "./Viewport/index.js";

export default class TileMap {
  constructor(options = {}) {
    TileMapValidator.validateInput(options);

    this.viewport = new TileMapViewport(options.x, options.y, options.width, options.height);
    this.renderer = new TileMapRenderer(this);

    this.chunkSize = options.chunkSize || 16;
    this.loadedChunks = new Set();
    this.activeChunks = new Set();
    this.chunkHysteresis = options.chunkHysteresis || 2;
    this.chunkUnloadDelay = options.chunkUnloadDelay || 5000;
    this.chunkUnloadTimers = new Map();

    this.tilesets = new Map();
    options.tilesets.forEach(tileset => {
      this.tilesets.set(tileset.key, tileset);
    });

    this.currentTilesetKey = this.tilesets.keys().next().value;
    this.layers = options.layers || [[]];

    this.chunkLoader = options.chunkLoader || new DefaultChunkLoader(this);
    this.chunkGenerator = options.chunkGenerator || new DefaultChunkGenerator(this);
    this.chunkManager = options.chunkManager || new DefaultChunkManager(this);
  }

  update(playerX, playerY) {
    const viewportCenterX = playerX - (this.viewport.width / 2);
    const viewportCenterY = playerY - (this.viewport.height / 2);

    this.viewport.update(viewportCenterX, viewportCenterY, this.viewport.width, this.viewport.height);
    this.chunkManager.manageChunkLoading(playerX, playerY);
  }

  renderViewport() {
    this.renderer.renderViewport();
  }

  mergeChunkToLayer(layer, chunkData, chunkX, chunkY) {
    const chunkSize = this.chunkSize;

    for (let y = 0; y < chunkSize; y++) {
      const globalY = chunkY * chunkSize + y;
      if (!layer[globalY]) layer[globalY] = [];

      for (let x = 0; x < chunkSize; x++) {
        const globalX = chunkX * chunkSize + x;
        if (!layer[globalY][globalX] || layer[globalY][globalX] === 0) {
          layer[globalY][globalX] = chunkData[y][x];
        }
      }
    }
  }

  removeChunkFromLayers(chunkKey) {
    const [chunkX, chunkY] = chunkKey.split(',').map(Number);
    const chunkSize = this.chunkSize;

    this.layers.forEach(layer => {
      for (let y = 0; y < chunkSize; y++) {
        const globalY = chunkY * chunkSize + y;
        if (!layer[globalY]) continue;

        for (let x = 0; x < chunkSize; x++) {
          const globalX = chunkX * chunkSize + x;
          if (layer[globalY] && layer[globalY][globalX]) {
            layer[globalY][globalX] = 0;
          }
        }
      }
    });
  }
}