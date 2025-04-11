export default class Collector {
  constructor() {
    this.collectedItems = [];
  }

  collect(item) {
    const collectable = item.getBehavior("Collectable");
    if (collectable && !collectable.isCollected) {
      item.collect();
      this.collectedItems.push(item.fruit);
    }
  }
}