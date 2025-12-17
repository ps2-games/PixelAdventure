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
        
        // Cache para otimização
        this.levelCache = {
            grounds: null,
            platforms: null,
            walls: null,
            ceilings: null,
            needsUpdate: true
        };
    }

    async onEnter() {
        this.createLevel();

        this.player = new Player({
            initialX: 100,
            initialY: 100,
            character: 0
        });

        // Cachear layers do nível uma única vez
        this.cacheLevelLayers();
    }

    onExit() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        this.levelColliders.forEach(id => Collision.unregister(id));
        this.levelColliders = [];
        
        // Limpar cache
        this.levelCache = {
            grounds: null,
            platforms: null,
            walls: null,
            ceilings: null,
            needsUpdate: true
        };
    }

    createLevel() {
        // Chão principal
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

        // Plataformas
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

        // Paredes laterais
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

        // Paredes para wall jump
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

        // Teto
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

    cacheLevelLayers() {
        // Buscar todas as layers UMA VEZ e guardar em cache
        this.levelCache.grounds = Collision.getByLayer('ground');
        this.levelCache.platforms = Collision.getByLayer('platform');
        this.levelCache.walls = Collision.getByLayer('wall');
        this.levelCache.ceilings = Collision.getByTag('ceiling');
        this.levelCache.needsUpdate = false;
    }

    drawLevel() {
        // Usar cache ao invés de buscar do Collision toda vez
        const { grounds, platforms, walls, ceilings } = this.levelCache;

        // Desenhar chão
        if (grounds) {
            for (let i = 0; i < grounds.length; i++) {
                const g = grounds[i];
                Draw.rect(g.x, g.y, g.w, g.h, Color.new(100, 100, 100));
            }
        }

        // Desenhar plataformas
        if (platforms) {
            for (let i = 0; i < platforms.length; i++) {
                const p = platforms[i];
                Draw.rect(p.x, p.y, p.w, p.h, Color.new(80, 160, 80));
            }
        }

        // Desenhar paredes
        if (walls) {
            for (let i = 0; i < walls.length; i++) {
                const w = walls[i];
                const isClimbable = w.tags.includes('climbable');
                const color = isClimbable 
                    ? Color.new(120, 80, 160) 
                    : Color.new(60, 60, 60);
                Draw.rect(w.x, w.y, w.w, w.h, color);
            }
        }

        // Desenhar tetos
        if (ceilings) {
            for (let i = 0; i < ceilings.length; i++) {
                const c = ceilings[i];
                Draw.rect(c.x, c.y, c.w, c.h, Color.new(80, 80, 80));
            }
        }
    }

    render() {
        super.renderBackground();

        // Desenhar nível (usando cache)
        this.drawLevel();

        // Atualizar jogador
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

        // Verificar colisões
        Collision.check();
    }
}