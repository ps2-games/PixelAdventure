import Player from "../modules/player/player.js";
import Collision from "../shared/collision.js";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../shared/constants.js";
import BaseScreen from "./baseScreen.js";

export default class GameScreen extends BaseScreen {
    constructor() {
        super();
        this.player = null;
        this.levelColliders = [];
        this.debugMode = false;
    }

    async onEnter() {
        this.createLevel();

        this.player = new Player({
            initialX: 100,
            initialY: 100,
            character: 0
        });
    }

    onExit() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        this.levelColliders.forEach(id => Collision.unregister(id));
        this.levelColliders = [];
    }

    createLevel() {
        this.levelColliders.push(
            Collision.register({
                type: 'rect',
                x: 0,
                y: SCREEN_HEIGHT - 24,
                w: SCREEN_WIDTH,
                h: 24,
                static: true,
                layer: 'ground',
                mask: [],
                tags: ['ground', 'solid'],
                data: { name: 'main_floor' }
            })
        );

        const platforms = [
            { x: 50, y: 350, w: 120, h: 16 },
            { x: 220, y: 280, w: 140, h: 16 },
            { x: 420, y: 200, w: 100, h: 16 },
            { x: 300, y: 150, w: 80, h: 16 },
        ];

        platforms.forEach((p, index) => {
            this.levelColliders.push(
                Collision.register({
                    type: 'rect',
                    ...p,
                    static: true,
                    layer: 'platform',
                    mask: [],
                    tags: ['platform', 'solid'],
                    data: { name: `platform_${index}` }
                })
            );
        });

        this.levelColliders.push(
            Collision.register({
                type: 'rect',
                x: -16,
                y: 0,
                w: 16,
                h: SCREEN_HEIGHT,
                static: true,
                layer: 'wall',
                mask: [],
                tags: ['wall', 'boundary'],
                data: { name: 'left_wall' }
            })
        );

        this.levelColliders.push(
            Collision.register({
                type: 'rect',
                x: SCREEN_WIDTH,
                y: 0,
                w: 16,
                h: SCREEN_HEIGHT,
                static: true,
                layer: 'wall',
                mask: [],
                tags: ['wall', 'boundary'],
                data: { name: 'right_wall' }
            })
        );

        this.levelColliders.push(
            Collision.register({
                type: 'rect',
                x: 180,
                y: 200,
                w: 16,
                h: 150,
                static: true,
                layer: 'wall',
                mask: [],
                tags: ['wall', 'climbable'],
                data: { name: 'jump_wall_left' }
            })
        );

        this.levelColliders.push(
            Collision.register({
                type: 'rect',
                x: 450,
                y: 250,
                w: 16,
                h: 120,
                static: true,
                layer: 'wall',
                mask: [],
                tags: ['wall', 'climbable'],
                data: { name: 'jump_wall_right' }
            })
        );

        this.levelColliders.push(
            Collision.register({
                type: 'rect',
                x: 300,
                y: 80,
                w: 200,
                h: 16,
                static: true,
                layer: 'ground',
                mask: [],
                tags: ['ceiling', 'solid'],
                data: { name: 'ceiling_block' }
            })
        );
    }

    drawLevel() {
        const grounds = Collision.getByLayer('ground');
        grounds.forEach(g => {
            Draw.rect(g.x, g.y, g.w, g.h, Color.new(100, 100, 100));
        });

        const platforms = Collision.getByLayer('platform');
        platforms.forEach(p => {
            Draw.rect(p.x, p.y, p.w, p.h, Color.new(80, 160, 80));
        });

        const walls = Collision.getByLayer('wall');
        walls.forEach(w => {
            const isClimbable = w.tags.includes('climbable');
            const color = isClimbable 
                ? Color.new(120, 80, 160) 
                : Color.new(60, 60, 60);
            Draw.rect(w.x, w.y, w.w, w.h, color);
        });

        const ceilings = Collision.getByTag('ceiling');
        ceilings.forEach(c => {
            Draw.rect(c.x, c.y, c.w, c.h, Color.new(80, 80, 80));
        });
    }

    render() {
        super.renderBackground();

        this.drawLevel();

        if (this.player) {
            this.player.update();

            if (this.player.shouldRemove()) {
                this.player.destroy();
            }
        }

        Collision.check();
    }
}