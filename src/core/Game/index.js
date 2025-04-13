export default class Game {
  constructor(scene) {
    this.scene = scene;
  }

  start() {
    Screen.display(() => this.scene.update());
  }
}
