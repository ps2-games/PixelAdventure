import Assets from "./assets.js";
import { ASSETS_PATH } from "./constants.js";
import Entity from "./Entity.js";

export default class SpikeTrap extends Entity {
    constructor(x, y, player) {
        super(x, y, 16, 16);
        this.image = Assets.image(`${ASSETS_PATH.TRAPS}/Spikes/idle.png`);
        this.x = x;
        this.y = y;
        this.player = player;
        this.isActive = true;
    }


    draw() {
        this.image.draw(this.x, this.y);
    }

    killPlayer() {
        if (this.player && this.isColliding(this.player)) {
            this.player.die();
        }
    }

    getBounds() {
        this._bounds.left = this.x;
        this._bounds.top = this.y + 8;
        this._bounds.right = this.x + this.width;
        this._bounds.bottom = this.y + this.height;

        return this._bounds;
    }

    update() {
        this.draw()
        this.killPlayer()
    }
}