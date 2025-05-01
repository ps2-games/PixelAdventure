import TrapTypes from "../../../@types/trap-types.js";
import SpikeTrap from "../../entities/Spike/index.js";

export default class TrapManager {
    constructor(player) {
        this.traps = [];
        this.player = player;
    }

    addTrap(type, x, y) {
        let trap;
        switch (type.toLowerCase()) {
            case TrapTypes.SPIKE:
                trap = new SpikeTrap(x, y, this.player);
                break;
            case TrapTypes.SPIKE_HEAD:
                break;
            case TrapTypes.JUMP_BOX:
                break;
            default:
                throw new Error(`Tipo de armadilha desconhecido: ${type}`);
        }
        this.traps.push(trap);
        return trap;
    }

    update(deltaTime) {
        let i = 0;
        while (i < this.traps.length) {
            const trap = this.traps[i];
            trap.update(deltaTime);

            if (!trap.isActive) {
                this.traps[i] = this.traps[this.traps.length - 1];
                this.traps.pop();
            } else {
                i++;
            }
        }
    }
}