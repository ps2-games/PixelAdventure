import Animation from "./animation.js";

export const SawAnimationState = {
    ON: 'ON',
};

const SAW_ANIMATIONS = {
    [SawAnimationState.ON]: new Animation(
        "traps/Saw/On.png",
        8,
        25,
        38,
        38,
        true
    )
}

export default SAW_ANIMATIONS