import Animation from "../../../Animation/index.js";

export const RockHeadAnimationState = {
    IDLE: 'IDLE',
    BLINK: 'BLINK',
    BOTTOM_HIT: 'BOTTOM_HIT',
    TOP_HIT: 'TOP_HIT',
    LEFT_HIT: 'LEFT_HIT',
    RIGHT_HIT: 'RIGHT_HIT',
};

const ROCK_HEAD_ANIMATIONS = {
    [RockHeadAnimationState.IDLE]: new Animation(
        "Sheets/traps/RockHead/Idle.png",
        1,
        100,
        42,
        42,
        true
    ),
    [RockHeadAnimationState.BLINK]: new Animation(
        "Sheets/traps/RockHead/Blink.png",
        4,
        100,
        42,
        42,
        false
    ),
    [RockHeadAnimationState.BOTTOM_HIT]: new Animation(
        "Sheets/traps/RockHead/BottomHit.png",
        4,
        100,
        42,
        42,
        false
    ),
    [RockHeadAnimationState.TOP_HIT]: new Animation(
        "Sheets/traps/RockHead/TopHit.png",
        4,
        100,
        42,
        42,
        false
    ),
    [RockHeadAnimationState.LEFT_HIT]: new Animation(
        "Sheets/traps/RockHead/LeftHit.png",
        4,
        100,
        42,
        42,
        false
    ),
    [RockHeadAnimationState.RIGHT_HIT]: new Animation(
        "Sheets/traps/RockHead/RightHit.png",
        4,
        100,
        42,
        42,
        false
    ),
}

export default ROCK_HEAD_ANIMATIONS