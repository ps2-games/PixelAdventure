export default class Collector {
  constructor() {
    this.collectedItems = [];
  }

  collect(item, scene) {
    const collectable = item.getBehavior("Collectable");
    if (collectable && !collectable.isCollected) {
      item.collect(scene);
      this.collectedItems.push(item.fruit);
    }
  }
}