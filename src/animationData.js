import Assets from "./assets.js";
import { ASSETS_PATH } from "./constants.js";

export const PLAYER_ANIMATION = {
    IDLE: 'IDLE',
    RUN: 'RUN',
    JUMP: 'JUMP',
    FALL: 'FALL',
    DOUBLE_JUMP: 'DOUBLE_JUMP',
    WALL_JUMP: 'WALL_JUMP',
    HIT: "HIT",
};

export const BOX_TRAP_ANIMATION = {
    IDLE: 'IDLE',
    HIT: 'HIT',
    BREAK: 'BREAK'
};

export const SAW_TRAP_ANIMATIONS = {
    ON: 'ON',
};

export const FRUIT_ANIMATION_STATE = {
    IDLE: 'IDLE',
    COLLECTED: 'COLLECTED'
};

export const ANIM_DATA = Object.freeze({
    PLAYER: {
        [PLAYER_ANIMATION.IDLE]: {
            totalFrames: 11,
            fps: 12,
            frameWidth: 32,
            frameHeight: 32,
            loop: true,
            image: Assets.image(`${ASSETS_PATH.NinjaFrog}/Idle.png`)
        },
        [PLAYER_ANIMATION.RUN]: {
            totalFrames: 12,
            fps: 6,
            frameWidth: 32,
            frameHeight: 32,
            loop: true,
            image: Assets.image(`${ASSETS_PATH.NinjaFrog}/Run.png`)
        },
        [PLAYER_ANIMATION.JUMP]: {
            totalFrames: 1,
            fps: 12,
            frameWidth: 32,
            frameHeight: 32,
            loop: false,
            image: Assets.image(`${ASSETS_PATH.NinjaFrog}/Jump.png`)
        },
        [PLAYER_ANIMATION.DOUBLE_JUMP]: {
            totalFrames: 6,
            fps: 12,
            frameWidth: 32,
            frameHeight: 32,
            loop: true,
            image: Assets.image(`${ASSETS_PATH.NinjaFrog}/Double_Jump.png`)
        },
        [PLAYER_ANIMATION.FALL]: {
            totalFrames: 1,
            fps: 12,
            frameWidth: 32,
            frameHeight: 32,
            loop: false,
            image: Assets.image(`${ASSETS_PATH.NinjaFrog}/Fall.png`)
        },
        [PLAYER_ANIMATION.WALL_JUMP]: {
            totalFrames: 5,
            fps: 12,
            frameWidth: 32,
            frameHeight: 32,
            loop: true,
            image: Assets.image(`${ASSETS_PATH.NinjaFrog}/Wall_Jump.png`)
        },
        [PLAYER_ANIMATION.HIT]: {
            totalFrames: 7,
            fps: 12,
            frameWidth: 32,
            frameHeight: 32,
            loop: false,
            image: Assets.image(`${ASSETS_PATH.NinjaFrog}/Hit.png`)
        }
    },
    BOX_TRAP: {
        [BOX_TRAP_ANIMATION.IDLE]: {
            totalFrames: 1,
            fps: 12,
            frameWidth: 28,
            frameHeight: 24,
            loop: false,
            image: Assets.image(`${ASSETS_PATH.TRAPS}/Box1/Idle.png`)
        },
        [BOX_TRAP_ANIMATION.HIT]: {
            totalFrames: 3,
            fps: 12,
            frameWidth: 28,
            frameHeight: 24,
            loop: false,
            image: Assets.image(`${ASSETS_PATH.TRAPS}/Box1/Hit.png`)
        },
        [BOX_TRAP_ANIMATION.BREAK]: {
            totalFrames: 4,
            fps: 12,
            frameWidth: 28,
            frameHeight: 24,
            loop: false,
            image: Assets.image(`${ASSETS_PATH.TRAPS}/Box1/Break.png`)
        }
    },
    SAW_TRAP: {
        [SAW_TRAP_ANIMATIONS.ON]: {
            totalFrames: 8,
            fps: 5,
            frameWidth: 38,
            frameHeight: 38,
            loop: true,
            image: Assets.image(`${ASSETS_PATH.TRAPS}/Saw/On.png`)
        }
    },
})