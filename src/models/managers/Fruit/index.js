import Fruit from "../../entities/Fruits/index.js";

export default class FruitManager {
    constructor(collector) {
        this.fruits = []
        this.fruitSlot = 0;
        this.fruitSlotSize = 4;

        this.collector = collector

        this.pickupFruitSound = Sound.load('./assets/sounds/pickup_fruit.adp');
    }

    addFruit(type, x, y) {
        const fruit = new Fruit(type, x, y, this.pickupFruitSound);
        this.fruits.push(fruit);
    }

    update() {
        this.fruits.forEach(fruit => {
            fruit.update(this.collector, this);
            fruit.draw();
        });

        this.fruits = this.fruits.filter(fruit => !fruit.shouldRemove());
    }
}