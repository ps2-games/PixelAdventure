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
        this.createLevel();

        this.player = new Player({
            initialX: 100,
            initialY: 250,
            character: 0
        });

        this.fruits.push(new Fruit(FRUITS.APPLE, 250, 250));
    }

    onExit() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        this.fruits.forEach(fruit => fruit.destroy());
        this.fruits = [];
    }

    createLevel() {
        const file = std.open("data.json", "r");
        const jsonString = file.readAsString();

        file.close();

        const mapData = JSON.parse(jsonString);

        this.tileRender = new TilemapRenderer(mapData.tiles);

        if(mapData.colliders){
            this.createColliders(mapData.colliders)
        }
    }

    createColliders(colliders) {
        for (let index = 0; index < colliders.length; index++) {
            Collision.register(colliders[index])
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
                this.player = new Player({
                    initialX: 100,
                    initialY: 100,
                    character: 0
                });
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