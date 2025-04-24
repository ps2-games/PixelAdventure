import Animation from "../../../Animation/index.js";

export const PlayerAnimationsStates = {
    IDLE: 'IDLE',
    RUN: 'RUN',
    JUMP: 'JUMP',
    FALL: 'FALL',
    DOUBLE_JUMP: 'DOUBLE_JUMP',
    WALL_JUMP: 'WALL_JUMP'
};

const PLAYER_ANIMATIONS = {
    [PlayerAnimationsStates.IDLE]: new Animation(
        "Sheets/ninjaFrog/Idle.png",
        11,
        100,
        32,
        32,
        true
    ),
    [PlayerAnimationsStates.RUN]: new Animation(
        "Sheets/ninjaFrog/Run.png",
        12,
        50,
        32,
        32,
        true
    ),
    [PlayerAnimationsStates.JUMP]: new Animation(
        "Sheets/ninjaFrog/Jump.png",
        1,
        100,
        32,
        32,
        false
    ),
    [PlayerAnimationsStates.DOUBLE_JUMP]: new Animation(
        "Sheets/ninjaFrog/Double_Jump.png",
        6,
        100,
        32,
        32,
        true
    ),
    [PlayerAnimationsStates.FALL]: new Animation(
        "Sheets/ninjaFrog/Fall.png",
        1,
        100,
        32,
        32,
        false
    ),
    [PlayerAnimationsStates.WALL_JUMP]: new Animation(
        "Sheets/ninjaFrog/Wall_Jump.png",
        5,
        100,
        32,
        32,
        true
    )
}

export  default  PLAYER_ANIMATIONS