import TrapTypes from "../../../@types/trap-types.js";
import BoxTrap from "../../entities/Box/index.js";
import RockHead from "../../entities/RockHead/index.js";
import SawTrap from "../../entities/Saw/index.js";
import SpikeTrap from "../../entities/Spike/index.js";
import SpikeHead from "../../entities/SpikeHead/index.js";

export default class TrapManager {
    constructor(player, tileMap) {
        this.traps = [];
        this.player = player;
        this.tileMap = tileMap;
    }

    addTrap(type, x, y, options) {
        let trap;
        switch (type.toLowerCase()) {
            case TrapTypes.SPIKE:
                trap = new SpikeTrap(x, y, this.player);
                break;
            case TrapTypes.SPIKE_HEAD:
                trap = new SpikeHead(x, y, this.player);
                break;
            case TrapTypes.ROCK_HEAD:
                trap = new RockHead(x, y, this.player, { ...options, tileMap: this.tileMap });
                break;
            case TrapTypes.BOX:
                trap = new BoxTrap(x, y, this.player);
                break;
            case TrapTypes.SAW:
                trap = new SawTrap(x, y, this.player, options);
                break;
            default:
                throw new Error(`Tipo de armadilha desconhecido: ${type}`);
        }
        this.traps.push(trap);
        return trap;
    }

    checkRockHeadCollisions(trap, player) {
        if (!player || player.isDying) return;

        const playerBounds = player.getBounds();
        const trapBounds = trap.getBounds();

        if (
            playerBounds.right > trapBounds.left &&
            playerBounds.left < trapBounds.right &&
            playerBounds.bottom > trapBounds.top &&
            playerBounds.top < trapBounds.bottom
        ) {
            const overlapTop = playerBounds.bottom - trapBounds.top;
            const overlapBottom = trapBounds.bottom - playerBounds.top;
            const overlapLeft = playerBounds.right - trapBounds.left;
            const overlapRight = trapBounds.right - playerBounds.left;

            const minOverlap = Math.min(overlapTop, overlapBottom, overlapLeft, overlapRight);

            if (minOverlap === overlapTop && player.movementController.velocity.y >= 0) {
                const position = player.movementController.getPosition();
                player.movementController.setPosition(
                    position.x,
                    trapBounds.top - player.height + 1
                );

                player.movementController.velocity.y = 0;
                player.movementController.state.isGrounded = true;
                player.movementController.state.jumpsRemaining = player.movementController.state.maxJumps;

                if (trap.direction === 'HORIZONTAL') {
                    player.movementController.position.x += trap.velocity.x;
                } else if (trap.velocity.y < 0) {
                    player.movementController.position.y += trap.velocity.y;
                }

                if (player.movementController.callbacks.onLand) {
                    player.movementController.callbacks.onLand(player.movementController.velocity, true);
                }
            }
            else if (player.movementController.state.canMove) {
                player.die();
            }
        }
    }

    update(deltaTime) {
        const trapsLength = this.traps.length;
        for (let i = 0; i < trapsLength; i++) {
            const trap = this.traps[i];

            if (trap && trap.isActive) {
                trap.update(deltaTime);

                if (trap.constructor.name === 'RockHead') {
                    this.checkRockHeadCollisions(trap, this.player);
                }
            }
            else {
                this.traps[i] = this.traps[this.traps.length - 1];
                this.traps.pop();
            }
        }
    }
}