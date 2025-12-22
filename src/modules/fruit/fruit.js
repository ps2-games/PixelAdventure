import { animationHorizontalSprite } from "../../shared/animation.js";
import Assets from "../../shared/assets.js";
import Audio from "../../shared/audio.js";
import Collision from "../../shared/collision.js";
import { ASSETS_PATH, DELTA_TIME, FRUIT_ANIMATION, PICKUP_FRUI_SFX } from "../../shared/constants.js";

export default class Fruit {
    constructor(fruit, x, y) {
        this.fruitType = fruit;
        this.isCollected = false;

        this.position = { x, y };
        this._bounds = { left: 0, top: 0, right: 0, bottom: 0 };

        this.colliderId = null;

        this.state = FRUIT_ANIMATION.IDLE;

        this.animations = this._initAnimations();
        this.currentAnimation = this.animations[this.state];

        this._initCollider();
    }

    _initAnimations() {
        return {
            [FRUIT_ANIMATION.IDLE]: Assets.image(`${ASSETS_PATH.Fruits}/${this.fruitType}.png`, {
                totalFrames: 17,
                fps: 4,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [FRUIT_ANIMATION.COLLECTED]: Assets.image(`${ASSETS_PATH.VFX}/collected.png`, {
                totalFrames: 6,
                fps: 8,
                frameWidth: 32,
                frameHeight: 32,
                loop: false,
            })
        }
    }

_initCollider() {
    const fw = this.currentAnimation.frameWidth;
    const fh = this.currentAnimation.frameHeight;

    const halfW = fw / 2;
    const halfH = fh / 2;
    const quarterW = fw / 4;
    const quarterH = fh / 4;

    this.colliderId = Collision.register({
        type: 'rect',
        x: this.position.x + quarterW,
        y: this.position.y + quarterH,
        w: halfW,
        h: halfH,
        layer: 'fruit',
        mask: ['player'],
        tags: ['fruit', 'collectible'],
        data: { entity: this },
        onCollision: (config) => {
            if (config.layer === 'player' && !this.isCollected) {
                this.collect();
            }
        }
    });
}

    collect() {
        if (this.isCollected) return;

        Audio.playSfx(PICKUP_FRUI_SFX);

        this.state = FRUIT_ANIMATION.COLLECTED;
        this.currentAnimation = this.animations[this.state]

        if (this.colliderId !== null) {
            Collision.unregister(this.colliderId);
            this.colliderId = null;
        }

        this.isCollected = true;
    }

    update() {
        this.currentAnimation.deltaTime = DELTA_TIME;
        animationHorizontalSprite(this.currentAnimation);

        this.currentAnimation.draw(this.position.x, this.position.y);
    }

    destroy() {
        if (this.colliderId !== null) {
            Collision.unregister(this.colliderId);
            this.colliderId = null;
        }

        this.animations = null;
        this.currentAnimation = null;
        this.state = null;
    }

    shouldRemove() {
        if (this.state === FRUIT_ANIMATION.COLLECTED) return this.currentAnimation.currentFrame >= this.currentAnimation.totalFrames - 1;

        return false;
    }
}