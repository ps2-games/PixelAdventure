import { PlayerMovementConstants } from "./constants/movement.js";
import AnimatableEntity from "../AnimatableEntity/index.js";
import PLAYER_ANIMATIONS, { PlayerAnimationsStates } from "./constants/animation.js";
import PlayerMovementController from "./movement/index.js";

export default class Player extends AnimatableEntity {
  constructor(options = {}) {
    super(options.initialX || 0, options.initialY || 0, 32, 32, PLAYER_ANIMATIONS);

    this.deathRotation = 0;
    this.deathRotationSpeed = 0;
    this.deathVelocity = { x: 0, y: 0 };
    this.isDying = false;
    this.isDeathAnimationComplete = false;

    this._position = { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };
    this._bounds = { left: 0, top: 0, right: 0, bottom: 0 };
    this._currentState = null;

    const onJump = (canMove) => canMove && this.setAnimation(PlayerAnimationsStates.JUMP);
    const onDoubleJump = (canMove) => canMove && this.setAnimation(PlayerAnimationsStates.DOUBLE_JUMP);

    const onDirectionChange = (direction, canMove) => {
      if (canMove) {
        this.flipX = direction === PlayerMovementConstants.DIRECTION.LEFT;
      }
    };

    this.movementController = new PlayerMovementController({
      initialX: options.initialX || 0,
      initialY: options.initialY || 0,
      entity: this,
      tileMap: options.tileMap,
      callbacks: {
        onJump,
        onDoubleJump,
        onLand: (velocity, canMove) => {
          if (canMove) {
            this.setAnimation(velocity.x !== 0 ?
              PlayerAnimationsStates.RUN :
              PlayerAnimationsStates.IDLE);
          }
        },
        onDirectionChange,
        onWallSlideStart: (canMove) => {
          if (canMove) {
            this.setAnimation(PlayerAnimationsStates.WALL_JUMP);
          }
        },
        onWallSlideEnd: (canMove) => {
          if (canMove) {
            this.setAnimation(PlayerAnimationsStates.IDLE);
          }
        },
      }
    });

    this.pads = Pads.get();

    this.animations[PlayerAnimationsStates.HIT].onAnimationEnd = () => {
      this.isDeathAnimationComplete = true;
    };
  }

  handleAnimation() {
    if (this.isDying && this.isDeathAnimationComplete) {
      return;
    }

    const movementState = this.movementController.stateManager;
    const velocity = this.movementController.getVelocity();
    const jumpsRemaining = movementState.jumpsRemaining;
    const currentAnimation = this.getCurrentAnimation();
    const canMove = movementState.canMove;

    let newState;

    if (!canMove) {
      newState = PlayerAnimationsStates.HIT;
    } else if (velocity.y < 0) {
      newState = jumpsRemaining === 0 ?
        PlayerAnimationsStates.DOUBLE_JUMP :
        PlayerAnimationsStates.JUMP;
    } else if (velocity.y > 0) {
      newState = movementState.isWallSliding ?
        PlayerAnimationsStates.WALL_JUMP :
        PlayerAnimationsStates.FALL;
    } else {
      newState = velocity.x !== 0 ?
        PlayerAnimationsStates.RUN :
        PlayerAnimationsStates.IDLE;
    }

    if (currentAnimation !== this.animations[newState]) {
      this.setAnimation(newState);
    }

    this.updateAnimation();
  }

  handleInput() {
    this.pads.update();

    let moving = false;

    if (this.pads.pressed(Pads.RIGHT)) {
      this.movementController.moveRight();
      moving = true;
    } else if (this.pads.pressed(Pads.LEFT)) {
      this.movementController.moveLeft();
      moving = true;
    }

    if (this.pads.justPressed(Pads.UP)) {
      this.movementController.jump();
    }

    if (!moving) {
      this.movementController.stopHorizontalMovement();
    }

    // this.drawCollisionBox(this.movementController.position.x, this.movementController.position.y)
  }

  update(deltaTime = 16.67) {
    if (!this.isDying) {
      this.handleInput();
      this.movementController.update(deltaTime);
    } else {
      this.deathRotation += this.deathRotationSpeed * deltaTime;

      const position = this.movementController.getPosition();
      this.movementController.setPosition(
        position.x + this.deathVelocity.x * deltaTime,
        position.y + this.deathVelocity.y * deltaTime
      );

      this.deathVelocity.y += 0.5 * deltaTime;
    }

    this.handleAnimation();
    this.draw();
  }

  getBounds() {
    const position = this.movementController.getPosition();
    const { frameHeight } = this.getCurrentAnimation();

    this._bounds.left = position.x;
    this._bounds.top = position.y + 6;
    this._bounds.right = position.x + 28;
    this._bounds.bottom = position.y + frameHeight;

    return this._bounds;
  }

  draw() {
    const currentAnimation = this.getCurrentAnimation();
    const { frameWidth, frameHeight, image } = currentAnimation;
    const frameX = this.getCurrentFrame() * frameWidth;
    const position = this.movementController.getPosition();
    const isWallSliding = this.movementController.stateManager.isWallSliding;

    const xOffset = isWallSliding ? (this.flipX ? -5 : 5) : 0;
    const drawX = this.flipX ?
      position.x + frameWidth + xOffset :
      position.x + xOffset;

    image.startx = frameX;
    image.starty = 0;
    image.endx = frameX + frameWidth;
    image.endy = frameHeight;
    image.angle = this.isDying ? this.deathRotation : 0;
    image.width = this.flipX ? -Math.abs(frameWidth) : Math.abs(frameWidth);
    image.height = frameHeight;

    image.draw(drawX, position.y);
  }

  die() {
    if (this.isDying) return;

    this.isDying = true;
    this.isDeathAnimationComplete = false;
    this.setAnimation(PlayerAnimationsStates.HIT);
    this.movementController.stateManager.canMove = false;

    const direction = this.movementController.stateManager.facingDirection === 'RIGHT' ? -1 : 1;
    this.deathVelocity.x = direction * 2;
    this.deathVelocity.y = -4;

    this.deathRotationSpeed = (Math.random() > 0.5 ? 1 : -1) * 0.05;
  }

  shouldRemove() {
    if (!this.isDying) return false;

    const position = this.movementController.getPosition();
    return position.y > 1000 || Math.abs(position.x) > 1000;
  }
}