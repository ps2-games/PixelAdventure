import Animatable from "../../behaviors/Animatable/index.js";
import Collector from "../../behaviors/Collector/index.js";
import Controllable from "../../behaviors/Controllable/index.js";
import Movable from "../../behaviors/Movable/index.js";
import Animation from "../../components/Animation/index.js";
import Entity from "../Entity/index.js";
import { PlayerMovementConstants } from "./constants/movement.js";
import { PlayerAnimationsStates } from "./state/animations.js";

export default class Player extends Entity {
  /**
   * @param {number} canvasWidth - Largura do canvas do jogo
   * @param {number} canvasHeight - Altura do canvas do jogo
   * @param {object} options - Opções de configuração do jogador
   */
  constructor(canvasWidth, canvasHeight, options = {}) {
    super(options.initialX || 0, options.initialY || 0, 32, 32);

    this.addBehavior(new Controllable(Pads.get()));
    this.addBehavior(new Animatable());

    this.addBehavior(new Movable(options.initialX || 0, options.initialY || 0, {
      gravity: options.gravity || PlayerMovementConstants.DEFAULT_GRAVITY,
      jumpStrength: options.jumpStrength || PlayerMovementConstants.DEFAULT_JUMP_STRENGTH,
      speed: options.speed || PlayerMovementConstants.DEFAULT_SPEED,
      minX: 0,
      maxX: canvasWidth - 32,
      maxY: canvasHeight - 32,
      onJump: () => this.getBehavior("Animatable").setAnimation(PlayerAnimationsStates.JUMP),
      onDoubleJump: () => this.getBehavior("Animatable").setAnimation(PlayerAnimationsStates.DOUBLE_JUMP),
      onLand: () => {
        const velocity = this.getBehavior("Movable").movement.getVelocity();
        if (velocity.x !== 0) {
          this.getBehavior("Animatable").setAnimation(PlayerAnimationsStates.RUN);
        } else {
          this.getBehavior("Animatable").setAnimation(PlayerAnimationsStates.IDLE);
        }
      },
      onDirectionChange: (direction) => {
        this.flipX = direction === PlayerMovementConstants.DIRECTION.LEFT;
      },
    }));

    const groundLevel = options.initialY || canvasHeight - 32;
    this.getBehavior("Movable").movement.setPosition(options.initialX || 0, groundLevel);
    this.addBehavior(new Collector())

    this.initializeAnimations();
  }

  /**
   * Inicializa todas as animações do jogador
   */
  initializeAnimations() {
    const animations = {
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
    };

    this.getBehavior("Animatable").initializeAnimations(animations);
  }

  /**
   * Atualiza o estado da animação baseado no estado do jogador
   */
  updateAnimation() {
    const animatable = this.getBehavior("Animatable");
    const movable = this.getBehavior("Movable");

    const velocity = movable.movement.getVelocity();
    const jumpsRemaining = movable.movement.state.jumpsRemaining;
    const currentState = animatable.getCurrentAnimation();

    let newState = PlayerAnimationsStates.IDLE;

    if (velocity.y < 0 && jumpsRemaining === 0) {
      newState = PlayerAnimationsStates.DOUBLE_JUMP;
    } else if (velocity.y < 0) {
      newState = PlayerAnimationsStates.JUMP;
    } else if (velocity.y > 0) {
      newState = PlayerAnimationsStates.FALL;
    } else if (velocity.x !== 0) {
      newState = PlayerAnimationsStates.RUN;
    }

    if (currentState !== newState) {
      animatable.setAnimation(newState);
    }

    animatable.updateAnimation();
  }

  /**
   * Processa os inputs do jogador
   */
  handleInput() {
    const controllable = this.getBehavior("Controllable");
    const movable = this.getBehavior("Movable");

    controllable.inputController.update();

    let moving = false;

    if (controllable.inputController.pressed(Pads.RIGHT)) {
      movable.movement.moveRight();
      moving = true;
    } else if (controllable.inputController.pressed(Pads.LEFT)) {
      movable.movement.moveLeft();
      moving = true;
    }

    if (!moving) {
      movable.movement.stopHorizontalMovement();
    }

    if (controllable.inputController.justPressed(Pads.UP)) {
      movable.movement.jump();
    }
  }

  /**
   * Atualiza o jogador
   */
  update() {
    this.handleInput();
    this.getBehavior("Movable").update();
    this.updateAnimation();
  }

  getBounds() {
    const movable = this.getBehavior("Movable");
    const position = movable.movement.getPosition();
    const animatable = this.getBehavior("Animatable");
    const { frameWidth, frameHeight } = animatable.getCurrentAnimation()

    return {
      left: position.x,
      top: position.y,
      right: position.x + frameWidth,
      bottom: position.y + frameHeight,
    };
  }

  isColliding(otherEntity) {
    if (!this.canCollide || !otherEntity.canCollide) {
      return false;
    }

    const a = this.getBounds();
    const b = otherEntity.getBounds();

    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }

  collectItem(item) {
    this.getBehavior("Collector").collect(item)
  }

  // drawUi(){
  //   const inventory = this.getBehavior("Collector").collectedItems;
  // }

  /**
   * Renderiza o jogador na tela
   */
  draw() {
    const animatable = this.getBehavior("Animatable");
    const movable = this.getBehavior("Movable");

    const { frameWidth, frameHeight, image } = animatable.getCurrentAnimation();
    const frameX = animatable.animationManager.getCurrentFrame() * frameWidth;
    const position = movable.movement.getPosition();

    image.startx = frameX;
    image.starty = 0;
    image.endx = frameX + frameWidth;
    image.endy = frameHeight;

    image.width = this.flipX ? -Math.abs(frameWidth) : Math.abs(frameWidth);
    image.height = frameHeight;

    if (this.flipX) {
      image.draw(position.x + frameWidth, position.y);
    } else {
      image.draw(position.x, position.y);
    }
  }
}