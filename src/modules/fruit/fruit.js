import { animationHorizontalSprite } from "../../shared/animation.js";
import Assets from "../../shared/assets.js";
import Audio from "../../shared/audio.js";
import Collision from "../../shared/collision.js";
import { ASSETS_PATH, DELTA_TIME, FRUIT_ANIMATION, PICKUP_FRUI_SFX } from "../../shared/constants.js";

export default class Fruit {
    constructor(fruit) {
        this.fruitType = fruit;
        this.isCollected = false;

        this.position = { x: 250, y: 250 };
        this._bounds = { left: 0, top: 0, right: 0, bottom: 0 };

        this.state = FRUIT_ANIMATION.IDLE;
        this.colliderId = null;

        this.animations = this._initAnimations();
        this.currentAnimation = this.animations[this.state];

        this._initCollider();
    }

    _initAnimations() {
        return {
            [FRUIT_ANIMATION.IDLE]: Assets.image(`${ASSETS_PATH.Fruits}/${this.fruitType}.png`, {
                totalFrames: 17,
                fps: 2,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            }),
            [FRUIT_ANIMATION.COLLECTED]: Assets.image(`${ASSETS_PATH.Fruits}/Collected.png`, {
                totalFrames: 6,
                fps: 2,
                frameWidth: 32,
                frameHeight: 32,
                loop: true,
            })
        }
    }

    _initCollider() {
        this.colliderId = Collision.register({
            type: 'rect',
            x: this.position.x,
            y: this.position.y,
            w: this.currentAnimation.frameWidth,
            h: this.currentAnimation.frameHeight,
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
        this.isCollected = true;
        this.state = FRUIT_ANIMATION.COLLECTED;
        this.currentAnimation = this.animations[this.state];
        
    }

    draw() {
        if (this.shouldRemove()) return;

        this.currentAnimation.deltaTime = DELTA_TIME;
        animationHorizontalSprite(this.currentAnimation);
        this.currentAnimation.draw(this.position.x, this.position.y);
    }

    updateCollider() {
        if (!this.colliderId || this.isCollected) return;
    
        Collision.update(this.colliderId, {
            x: this.position.x,
            y: this.position.y,
            w: this.currentAnimation.frameWidth,
            h: this.currentAnimation.frameHeight
        });
    }

    update() {
        this.updateCollider();
        this.draw();
    }

    destroy() {
        if (this.colliderId !== null) {
            Collision.unregister(this.colliderId);
            this.colliderId = null;
        }

        this.animations = null;
        this.currentAnimation = null;
    }

    shouldRemove() {
        return this.isCollected;
    }
}