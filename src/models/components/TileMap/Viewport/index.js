export default class TileMapViewport {
  constructor(x = 0, y = 0, width = 800, height = 600) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}