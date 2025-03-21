export default class Collector {
  constructor() {
    this.collectedItems = [];
  }

  collect(item) {
    const collectable = item.getBehavior("Collectable");
    if (collectable && !collectable.isCollected) {
      collectable.collect();
      this.collectedItems.push(item);
      console.log("Item adicionado à coleção!");
    }
  }
}