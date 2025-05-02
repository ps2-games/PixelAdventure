import TrapTypes from "../../../../@types/trap-types.js";

const traps = [
    {
        type: TrapTypes.SPIKE,
        x: 156,
        y: 112
    },
    {
        type: TrapTypes.SPIKE,
        x: 326,
        y: 385,
    },
    {
        type: TrapTypes.BOX,
        x: 440,
        y: 166
    },
    {
        type: TrapTypes.BOX,
        x: 504,
        y: 166
    },
    {
        type: TrapTypes.SAW,
        x: 380,
        y: 276,
        options: {
            endX: 238,
            speed: 1.5
        }
    },
]

export default traps;