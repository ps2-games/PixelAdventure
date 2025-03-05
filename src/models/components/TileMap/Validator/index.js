import TileSet from "../../TileSet/index.js";

export default class TileMapValidator {
  static validateInput(options) {
    if (!options.tilesets || !Array.isArray(options.tilesets) || options.tilesets.length === 0) {
      throw new Error("Pelo menos um tileset é obrigatório");
    }

    options.tilesets.forEach(tileset => {
      if (!(tileset instanceof TileSet)) {
        throw new Error("Todos os tilesets devem ser instâncias de TileSet");
      }
    });

    if (!options.layers || options.layers.length === 0) {
      throw new Error("Pelo menos uma camada de tiles é obrigatória");
    }
  }
}