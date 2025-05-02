import Animation from "../../../Animation/index.js";

export const SpikeHeadAnimationState = {
    IDLE: 'IDLE',
    BLINK: 'BLINK'
};

const SPIKE_HEAD_ANIMATIONS = {
    [SpikeHeadAnimationState.IDLE]: new Animation(
        "Sheets/traps/SpikeHead/Idle.png",
        1,
        100,
        54,
        52,
        true
    ),
    [SpikeHeadAnimationState.BLINK]: new Animation(
        "Sheets/traps/SpikeHead/Blink.png",
        4,
        100,
        54,
        52,
        false
    )
}

export default SPIKE_HEAD_ANIMATIONS