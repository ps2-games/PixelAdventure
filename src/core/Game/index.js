export default class Game {
  constructor(scene) {
    this.scene = scene;
  }

  start() {
    Screen.alphaBlendMode(0, 1, 0, 1, 0)
    Screen.display(() => this.scene.update());
  }
}
