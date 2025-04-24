import { PlayerMovementConstants } from "./constants/movement.js";
import AnimatableEntity from "../AnimatableEntity/index.js";
import PLAYER_ANIMATIONS, { PlayerAnimationsStates } from "./constants/animation.js";
import PlayerMovementController from "./movement/index.js";

export default class Player extends AnimatableEntity {
  constructor(canvasWidth, canvasHeight, options = {}) {
    super(options.initialX || 0, options.initialY || 0, 32, 32, PLAYER_ANIMATIONS);

    this.movementController = new PlayerMovementController({
      initialX: options.initialX || 0,
      initialY: options.initialY || 0,
      entity: this,
      tileMap: options.tileMap,
      onJump: () => this.setAnimation(PlayerAnimationsStates.JUMP),
      onDoubleJump: () => this.setAnimation(PlayerAnimationsStates.DOUBLE_JUMP),
      onLand: (velocity) => {
        if (velocity.x !== 0) {
          this.setAnimation(PlayerAnimationsStates.RUN);
        } else {
          this.setAnimation(PlayerAnimationsStates.IDLE);
        }
      },
      onDirectionChange: (direction) => {
        this.flipX = direction === PlayerMovementConstants.DIRECTION.LEFT;
      },
      onWallSlideStart: () => {
        this.setAnimation(PlayerAnimationsStates.WALL_JUMP)
      },
      onWallSlideEnd: () => {
        this.setAnimation(PlayerAnimationsStates.IDLE)
      },
    })

    this.pads = Pads.get();

  }


  handleAnimation() {

    const velocity = this.movementController.getVelocity();
    const jumpsRemaining = this.movementController.state.jumpsRemaining;
    const currentState = this.getCurrentAnimation();

    let newState = PlayerAnimationsStates.IDLE;

    if (velocity.y < 0 && jumpsRemaining === 0) {
      newState = PlayerAnimationsStates.DOUBLE_JUMP;
    } else if (velocity.y < 0) {
      newState = PlayerAnimationsStates.JUMP;
    } else if (velocity.y > 0 && !this.movementController.state.isWallSliding) {
      newState = PlayerAnimationsStates.FALL;
    }
    else if (velocity.y > 0 && this.movementController.state.isWallSliding) {
      newState = PlayerAnimationsStates.WALL_JUMP;
    } else if (velocity.x !== 0) {
      newState = PlayerAnimationsStates.RUN;
    }

    if (currentState !== newState) {
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

    if (!moving) {
      this.movementController.stopHorizontalMovement();
    }

    if (this.pads.justPressed(Pads.UP)) {
      this.movementController.jump();
    }
  }

  update() {
    this.handleInput();
    this.movementController.update();
    this.handleAnimation();
    this.draw();
  }

  getBounds() {
    const position = this.movementController.getPosition();
    const { frameWidth, frameHeight } = this.getCurrentAnimation()

    return {
      left: position.x,
      top: position.y,
      right: position.x + frameWidth,
      bottom: position.y + frameHeight,
    };
  }

  draw() {

    const { frameWidth, frameHeight, image } = this.getCurrentAnimation();
    const frameX = this.getCurrentFrame() * frameWidth;
    const position = this.movementController.getPosition();
    const isWallSliding = this.movementController.state.isWallSliding;

    const xOffset = isWallSliding ? (this.flipX ? -5 : 5) : 0;

    const drawX = this.flipX ?
      position.x + frameWidth + xOffset :
      position.x + xOffset;

    image.startx = frameX;
    image.starty = 0;
    image.endx = frameX + frameWidth;
    image.endy = frameHeight;

    image.width = this.flipX ? -Math.abs(frameWidth) : Math.abs(frameWidth);
    image.height = frameHeight;

    if (this.flipX) {
      image.draw(drawX, position.y);
    } else {
      image.draw(drawX, position.y);
    }
  }
}