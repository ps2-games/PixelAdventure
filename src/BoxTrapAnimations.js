import Animation from "./animation.js";

export const BoxAnimationState = {
    IDLE: 'IDLE',
    HIT: 'HIT',
    BREAK: 'BREAK'
};

const BOX_ANIMATIONS = {
    [BoxAnimationState.IDLE]: new Animation(
        "objects/Box1/Idle.png",
        1,
        100,
        28,
        24,
        true
    ),
    [BoxAnimationState.HIT]: new Animation(
        "objects/Box1/Hit.png",
        3,
        100,
        28,
        24,
        false
    ),
    [BoxAnimationState.BREAK]: new Animation(
        "objects/Box1/Break.png",
        4,
        100,
        28,
        24,
        false,
    ),
}

export default BOX_ANIMATIONS