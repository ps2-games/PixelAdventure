import Entity from "../Entity/index.js";

export default class JumpBoxTrap extends Entity {
    constructor(x, y,) {
        this.image = new Image("./assets/Sheets/objects/Box1/idle.png");
        this.x = x;
        this.y = y;
        this.player = player;
        this.isActive = true;
    }

    draw() {
        this.image.draw(this.x, this.y);
    }


    getBounds() {
        return {
            left: this.x,
            top: this.y + 8,
            right: this.x + this.width,
            bottom: this.y + this.height
        };
    }

    update() {
        this.draw()
    }
}