import Fruit from "../modules/fruit/fruit.js";
import Player from "../modules/player/player.js";
import TilemapRenderer from "../modules/tilemap/renderer.js";
import Collision from "../shared/collision.js";
import Input from "../shared/input.js";
import { FRUITS, PLAYERS_PORT } from "../shared/constants.js";
import BaseScreen from "./BaseScreen.js";

export default class GameScreen extends BaseScreen {
    constructor() {
        super();
        this.player = null;
        this.fruits = [];
    }

    async onEnter() {
        const mapData = this.readLevelData();

        if(mapData.tiles){
            this.tileRender = new TilemapRenderer(mapData.tiles);
        }

        if (mapData.colliders) {
            this.createColliders(mapData.colliders)
        }

        if (mapData.fruits) {
            this.createFruits(mapData.fruits)
        }

        this.player = new Player({
            initialX: mapData.player.x || 100,
            initialY: mapData.player.y || 250,
            character: 0
        });
    }

    onExit() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        this.fruits.forEach(fruit => fruit.destroy());
        this.fruits = [];
    }

    readLevelData() {
        const file = std.open("data.json", "r");
        const jsonString = file.readAsString();

        file.close();

        return JSON.parse(jsonString)
    }

    createColliders(colliders) {
        for (let index = 0; index < colliders.length; index++) {
            Collision.register(colliders[index])
        }
    }

    createFruits(fruits) {
        for (let index = 0; index < fruits.length; index++) {
            this.fruits.push(new Fruit(FRUITS[fruits[index][0]], fruits[index][1], fruits[index][2]));
        }
    }

    render() {
        super.renderBackground();

        if (Input.player(PLAYERS_PORT.PLAYER_ONE).pressed(Pads.R1)) {
            Collision.toggleDebug();
        }

        if (this.tileRender) {
            this.tileRender.draw(0, 0);
        }

        if (this.player) {
            this.player.update();
            if (this.player.shouldRemove()) {
                this.player.destroy();
                // this.player = new Player({
                //     initialX: 100,
                //     initialY: 250,
                //     character: 0
                // });
            }
        }

        for (let i = this.fruits.length - 1; i >= 0; i--) {
            const fruit = this.fruits[i];
            fruit.update();
            if (fruit.shouldRemove()) {
                fruit.destroy();
                this.fruits.splice(i, 1);
            }
        }

        Collision.check();

        Collision.renderDebug();
    }
}