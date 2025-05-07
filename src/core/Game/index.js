export default class Game {
  constructor(scene) {
    this.scene = scene;
    this.timer = Timer.new();
    this.lastTime = 0;
    this.timeStep = 1000 / 60;
    this.running = false;
  }

  start() {
    Screen.setFrameCounter(true);
    Screen.setVSync(false);
    this.running = true;
    Timer.reset(this.timer);
    this.lastTime = Timer.getTime(this.timer);
    Screen.display(() => this.gameLoop());
  }

  stop() {
    this.running = false;
    Timer.destroy(this.timer);
  }

  gameLoop() {
    if (!this.running) return;

    const currentTime = Timer.getTime(this.timer);
    let deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.scene.update(deltaTime / 16.67);
  }
}