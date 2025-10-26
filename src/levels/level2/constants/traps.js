import { TRAP_TYPES } from "../../../constants.js";

const traps = [
    {
        type: TRAP_TYPES.SPIKE,
        x: 156,
        y: 112
    },
    {
        type: TRAP_TYPES.SPIKE,
        x: 326,
        y: 385,
    },
    {
        type: TRAP_TYPES.BOX,
        x: 440,
        y: 166
    },
    {
        type: TRAP_TYPES.BOX,
        x: 504,
        y: 166
    },
    {
        type: TRAP_TYPES.SAW,
        x: 380,
        y: 276,
        options: {
            endX: 238,
            speed: 1.5
        }
    },
    {
        type: TRAP_TYPES.SPIKE_HEAD,
        x: 452,
        y: 220,
    },
]

export default traps;