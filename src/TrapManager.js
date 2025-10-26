import { TRAP_TYPES } from "./constants.js";
import BoxTrap from "./BoxTrap.js";
import SawTrap from "./SawTrap.js";
import SpikeTrap from "./SpikeTrap.js";

export default class TrapManager {
    constructor(player) {
        this.traps = [];
        this.player = player;
    }

    addTrap(type, x, y, options) {
        let trap;
        switch (type.toLowerCase()) {
            case TRAP_TYPES.SPIKE:
                trap = new SpikeTrap(x, y, this.player);
                break;
            case TRAP_TYPES.BOX:
                trap = new BoxTrap(x, y, this.player);
                break;
            case TRAP_TYPES.SAW:
                trap = new SawTrap(x, y, this.player, options);
                break;
            default:
                throw new Error(`Tipo de armadilha desconhecido: ${type}`);
        }
        this.traps.push(trap);
        return trap;
    }

    setPlayer(player) {
        this.player = player;
    }

    update(deltaTime) {
        const trapsLength = this.traps.length;
        for (let i = 0; i < trapsLength; i++) {
            const trap = this.traps[i];

            if (trap && trap.isActive) {
                trap.update(deltaTime);
                // trap.drawCollisionBox();
            }
            else {
                this.traps[i] = this.traps[this.traps.length - 1];
                this.traps.pop();
            }
        }
    }
}