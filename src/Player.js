import { PlayerMovementConstants } from "./PlayerMovementConfig.js";
import AnimatableEntity from "./AnimatableEntity.js";
import PlayerMovementController from "./PlayerMovement.js";
import InputManager from "./InputManager.js";
import { BUTTONS } from "./constants.js";
import { ANIM_DATA, PLAYER_ANIMATION } from "./animationData.js";

export default class Player extends AnimatableEntity {
  constructor(options = {}) {
    super(options.initialX || 0, options.initialY || 0, 32, 32, ANIM_DATA.PLAYER);

    this.deathRotation = 0;
    this.deathRotationSpeed = 0;
    this.deathVelocity = { x: 0, y: 0 };
    this.isDying = false;
    this.isDeathAnimationComplete = false;

    this._position = { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };
    this._bounds = { left: 0, top: 0, right: 0, bottom: 0 };
    this._currentState = null;

    const onJump = (canMove) => canMove && this.setAnimation(PLAYER_ANIMATION.JUMP);
    const onDoubleJump = (canMove) => canMove && this.setAnimation(PLAYER_ANIMATION.DOUBLE_JUMP);

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
              PLAYER_ANIMATION.RUN :
              PLAYER_ANIMATION.IDLE);
          }
        },
        onDirectionChange,
        onWallSlideStart: (canMove) => {
          if (canMove) {
            this.setAnimation(PLAYER_ANIMATION.WALL_JUMP);
          }
        },
        onWallSlideEnd: (canMove) => {
          if (canMove) {
            this.setAnimation(PLAYER_ANIMATION.IDLE);
          }
        },
      }
    });

    this.animations[PLAYER_ANIMATION.HIT].onAnimationEnd = () => {
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
    const isOnMovingPlatform = this.movementController.isOnMovingPlatform;

    let newState;

    if (!canMove) {
      newState = PLAYER_ANIMATION.HIT;
    }
    else if (isOnMovingPlatform) {
      newState = velocity.x !== 0 ?
        PLAYER_ANIMATION.RUN :
        PLAYER_ANIMATION.IDLE;
    } else if (velocity.y < 0) {
      newState = jumpsRemaining === 0 ?
        PLAYER_ANIMATION.DOUBLE_JUMP :
        PLAYER_ANIMATION.JUMP;
    } else if (velocity.y > 0) {
      newState = movementState.isWallSliding ?
        PLAYER_ANIMATION.WALL_JUMP :
        PLAYER_ANIMATION.FALL;
    } else {
      newState = velocity.x !== 0 ?
        PLAYER_ANIMATION.RUN :
        PLAYER_ANIMATION.IDLE;
    }

    if (currentAnimation !== this.animations[newState]) {
      this.setAnimation(newState);
    }

    this.updateAnimation();
  }

  handleInput() {
    let moving = false;

    if (InputManager.player(0).pressed(BUTTONS.RIGHT)) {
      this.movementController.moveRight();
      moving = true;
    } else if (InputManager.player(0).pressed(BUTTONS.LEFT)) {
      this.movementController.moveLeft();
      moving = true;
    }

    if (InputManager.player(0).pressed(BUTTONS.UP)) {
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
    this.setAnimation(PLAYER_ANIMATION.HIT);
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