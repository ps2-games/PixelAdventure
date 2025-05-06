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
    {
        type: TrapTypes.SPIKE_HEAD,
        x: 452,
        y: 220,
    },
    {
        type: TrapTypes.ROCK_HEAD,
        x: 186,
        y: 350,
        options: {
            direction: 'VERTICAL',
            speed: 0.1,
            acceleration: 5,
            maxVelocity: 20
        }
    },
]

export default traps;