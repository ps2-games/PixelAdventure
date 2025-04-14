import Fruit from "../index.js";

export default class FruitManager{

    constructor(){
        this.collectedFruitSound = Sound.load('./assets/sounds/pickup_fruit.adp');
        this.fruits = [];
        this.fruitSlot = 0;
        this.fruitSlotSize = 4;
    }

    addFruit(type, x, y) {
        const fruit = new Fruit(type, x, y, this.collectedFruitSound);
        this.fruits.push(fruit);
    }

    update(){
        this.fruits.forEach(fruit => {
            fruit.update(this.player, this);
            fruit.draw();
        });

        this.fruits = this.fruits.filter(fruit => !fruit.shouldRemove());
    }
}