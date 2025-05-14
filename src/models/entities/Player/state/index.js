export const PLAYER_STATE = {
    IS_JUMPING: 1,
    IS_GROUNDED: 1 << 1,
    IS_WALL_SLIDING: 1 << 2,
    CAN_MOVE: 1 << 3,
    AFFECTED_BY_GRAVITY: 1 << 4,
    FACING_RIGHT: 1 << 5,
};

export default class PlayerStateManager {
    constructor(parent, initialStateFlags) {
        this._parent = parent;
        this._stateFlags = initialStateFlags;
        this.jumpsRemaining = 2;
        this.maxJumps = 2;
    }

    get isJumping() { return (this._stateFlags & PLAYER_STATE.IS_JUMPING) !== 0; }

    set isJumping(value) {
        if (value) this._stateFlags |= PLAYER_STATE.IS_JUMPING;
        else this._stateFlags &= ~PLAYER_STATE.IS_JUMPING;
    }

    get facingDirection() { return (this._stateFlags & PLAYER_STATE.FACING_RIGHT) !== 0 ? 'RIGHT' : 'LEFT'; }

    set facingDirection(value) {
        if (value === 'RIGHT') this._stateFlags |= PLAYER_STATE.FACING_RIGHT;
        else this._stateFlags &= ~PLAYER_STATE.FACING_RIGHT;
    }

    get isGrounded() { return (this._stateFlags & PLAYER_STATE.IS_GROUNDED) !== 0; }

    set isGrounded(value) {
        if (value) this._stateFlags |= PLAYER_STATE.IS_GROUNDED;
        else this._stateFlags &= ~PLAYER_STATE.IS_GROUNDED;
    }

    get affectedByGravity() { return (this._stateFlags & PLAYER_STATE.AFFECTED_BY_GRAVITY) !== 0; }

    set affectedByGravity(value) {
        if (value) this._stateFlags |= PLAYER_STATE.AFFECTED_BY_GRAVITY;
        else this._stateFlags &= ~PLAYER_STATE.AFFECTED_BY_GRAVITY;
    }

    get isWallSliding() { return (this._stateFlags & PLAYER_STATE.IS_WALL_SLIDING) !== 0; }

    set isWallSliding(value) {
        if (value) this._stateFlags |= PLAYER_STATE.IS_WALL_SLIDING;
        else this._stateFlags &= ~PLAYER_STATE.IS_WALL_SLIDING;
    }

    get canMove() { return (this._stateFlags & PLAYER_STATE.CAN_MOVE) !== 0; }

    set canMove(value) {
        if (value) this._stateFlags |= PLAYER_STATE.CAN_MOVE;
        else this._stateFlags &= ~PLAYER_STATE.CAN_MOVE;
    }

    getStateFlags() {
        return this._stateFlags;
    }

    setStateFlags(flags) {
        this._stateFlags = flags;
    }
}