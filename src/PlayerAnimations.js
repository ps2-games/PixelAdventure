import Animation from "./animation.js";

export const PlayerAnimationsStates = {
    IDLE: 'IDLE',
    RUN: 'RUN',
    JUMP: 'JUMP',
    FALL: 'FALL',
    DOUBLE_JUMP: 'DOUBLE_JUMP',
    WALL_JUMP: 'WALL_JUMP',
    HIT: "HIT",
};

const PLAYER_ANIMATIONS = {
    [PlayerAnimationsStates.IDLE]: new Animation(
        "ninjaFrog/Idle.png",
        11,
        100,
        32,
        32,
        true
    ),
    [PlayerAnimationsStates.RUN]: new Animation(
        "ninjaFrog/Run.png",
        12,
        50,
        32,
        32,
        true
    ),
    [PlayerAnimationsStates.JUMP]: new Animation(
        "ninjaFrog/Jump.png",
        1,
        100,
        32,
        32,
        false
    ),
    [PlayerAnimationsStates.DOUBLE_JUMP]: new Animation(
        "ninjaFrog/Double_Jump.png",
        6,
        100,
        32,
        32,
        true
    ),
    [PlayerAnimationsStates.FALL]: new Animation(
        "ninjaFrog/Fall.png",
        1,
        100,
        32,
        32,
        false
    ),
    [PlayerAnimationsStates.WALL_JUMP]: new Animation(
        "ninjaFrog/Wall_Jump.png",
        5,
        100,
        32,
        32,
        true
    ),
    [PlayerAnimationsStates.HIT]: new Animation(
        "ninjaFrog/Hit.png",
        7,
        100,
        32,
        32,
        false
    )
}

export default PLAYER_ANIMATIONS