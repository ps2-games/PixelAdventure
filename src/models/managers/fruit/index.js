import Fruit from "../../entities/Fruits/index.js";

export default class FruitManager {
    constructor(collector) {
        this.fruits = [];
        this.fruitSlot = 0;
        this.fruitSlotSize = 4;
        this.collector = collector;
        this.pickupFruitSound = Sound.load('./assets/sounds/pickup_fruit.adp');
    }

    addFruit(type, x, y) {
        const fruit = new Fruit(type, x, y, this.pickupFruitSound);
        this.fruits.push(fruit);
    }

    update() {
        let i = 0;
        while (i < this.fruits.length) {
            const fruit = this.fruits[i];
            fruit.update(this.collector, this);

            if (fruit.shouldRemove()) {
                this.fruits[i] = this.fruits[this.fruits.length - 1];
                this.fruits.pop();
            } else {
                fruit.draw();
                i++;
            }
        }
    }
}