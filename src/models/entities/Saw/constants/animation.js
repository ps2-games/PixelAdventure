import Animation from "../../../Animation/index.js";

export const SawAnimationState = {
    ON: 'ON',
};

const SAW_ANIMATIONS = {
    [SawAnimationState.ON]: new Animation(
        "Sheets/traps/Saw/On.png",
        8,
        25,
        38,
        38,
        true
    )
}

export default SAW_ANIMATIONS