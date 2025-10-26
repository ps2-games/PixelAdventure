import AnimatableEntity from "./AnimatableEntity.js";
import SAW_ANIMATIONS from "./SawTrapAnimations.js";

export default class SawTrap extends AnimatableEntity {
    constructor(x, y, player, options = {}) {
        super(x, y, 38, 38, SAW_ANIMATIONS);
        this.x = x;
        this.y = y;
        this.player = player;
        this.isActive = true;
        this.initialX = x;

        this.state = {
            isOn: true
        };

        this.speed = options.speed || 2;

        if (options.endX !== undefined) {
            this.endX = options.endX;
            this.direction = this.endX > this.x ? 1 : -1;
        } else {
            this.endX = null;
        }
    }

    moveToEndX(deltaTime) {
        if (this.endX === null) return;

        this.x += (this.speed * this.direction) * deltaTime;

        if ((this.direction === 1 && this.x >= this.initialX) ||
            (this.direction === -1 && this.x <= this.endX)) {
            this.direction *= -1;

            if (this.direction === 1) {
                this.x = this.endX;
            } else {
                this.x = this.initialX;
            }
        }
    }

    draw() {
        const { frameWidth, frameHeight, image } = this.getCurrentAnimation();
        const frameX = this.getCurrentFrame() * frameWidth;

        image.startx = frameX;
        image.starty = 0;
        image.endx = frameX + frameWidth;
        image.endy = frameHeight;
        image.width = frameWidth;
        image.height = frameHeight;

        image.draw(this.x, this.y);
    }

    killPlayer() {
        if (this.isColliding(this.player)) {
            this.player.die();
        }
    }

    update(deltaTime) {
        this.moveToEndX(deltaTime);
        this.draw();
        this.killPlayer();
        this.updateAnimation();
    }
}