export default class Collectable {
  constructor() {
    this.isCollected = false;
  }

  collect() {
    if (!this.isCollected) {
      this.isCollected = true;
    }
  }
}