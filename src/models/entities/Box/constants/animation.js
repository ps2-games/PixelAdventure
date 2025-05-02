import Animation from "../../../Animation/index.js";

export const BoxAnimationState = {
    IDLE: 'IDLE',
    HIT: 'HIT',
    BREAK: 'BREAK'
};

const BOX_ANIMATIONS = {
    [BoxAnimationState.IDLE]: new Animation(
        "Sheets/objects/Box1/Idle.png",
        1,
        100,
        28,
        24,
        true
    ),
    [BoxAnimationState.HIT]: new Animation(
        "Sheets/objects/Box1/Hit.png",
        3,
        100,
        28,
        24,
        false
    ),
    [BoxAnimationState.BREAK]: new Animation(
        "Sheets/objects/Box1/Break.png",
        4,
        100,
        28,
        24,
        false,
    ),
}

export default BOX_ANIMATIONS