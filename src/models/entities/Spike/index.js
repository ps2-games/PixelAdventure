import Entity from "../Entity/index.js";
import { PlayerAnimationsStates } from "../Player/constants/animation.js";

export default class SpikeTrap extends Entity {
    constructor(x, y, player) {
        super(x, y, 5, 5);
        this.image = new Image("./assets/Sheets/traps/Spikes/idle.png");
        this.x = x;
        this.y = y;
        this.player = player;
    }


    draw() {
        this.image.draw(this.x, this.y);
    }

    killPlayer() {
        if (this.player && this.isColliding(this.player)) {
            this.player.die();
        }
    }
}