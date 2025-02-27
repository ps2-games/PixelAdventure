import ControllableEntity from "../../behaviors/ControllableEntity/index.js";
import Animation from "../../components/Animation/index.js";
import { PlayerMovementConstants } from "./constants/movement.js";
import { PlayerAnimationsStates } from "./state/animations.js";

export default class Player extends ControllableEntity {
  /**
   * @param {number} canvasWidth - Largura do canvas do jogo
   * @param {number} canvasHeight - Altura do canvas do jogo
   * @param {object} options - Opções de configuração do jogador
   */
  constructor(canvasWidth, canvasHeight, options = {}) {
    super(0, 0, {}, Pads.get());

    this.initializeAnimations();

    const spriteHeight = this.getCurrentAnimation().frameHeight;
    const groundLevel = canvasHeight - spriteHeight;

    this.initializeMovement({
      gravity: options.gravity || PlayerMovementConstants.DEFAULT_GRAVITY,
      jumpStrength: options.jumpStrength || PlayerMovementConstants.DEFAULT_JUMP_STRENGTH,
      speed: options.speed || PlayerMovementConstants.DEFAULT_SPEED,
      minX: 0,
      maxX: canvasWidth - this.getCurrentAnimation().frameWidth,
      maxY: groundLevel,
      onJump: () => super.setAnimation(PlayerAnimationsStates.JUMP),
      onLand: () => {
        if (this.movement.getVelocity().x !== 0) {
          super.setAnimation(PlayerAnimationsStates.RUN);
        } else {
          super.setAnimation(PlayerAnimationsStates.IDLE);
        }
      },
      onDirectionChange: (direction) => {
        this.flipX = direction === PlayerMovementConstants.DIRECTION.LEFT;
      },
    });

    this.movement.setPosition(0, groundLevel);
    
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
      [PlayerAnimationsStates.FALL]: new Animation(
        "Sheets/ninjaFrog/Fall.png",
        1,
        100,
        32,
        32,
        false
      ),
    };

    super.initializeAnimations(animations);
  }
  /**
   * Atualiza o estado da animação baseado no estado do jogador
   */
  updateAnimation() {
    super.updateAnimation();

    const velocity = this.movement.getVelocity();
    const currentState = this.animationManager.getCurrentAnimation();

    let newState = PlayerAnimationsStates.IDLE;

    if (velocity.y < 0) {
      newState = PlayerAnimationsStates.JUMP;
    } else if (velocity.y > 0) {
      newState = PlayerAnimationsStates.FALL;
    } else if (velocity.x !== 0) {
      newState = PlayerAnimationsStates.RUN;
    }

    if (currentState !== newState) {
      super.setAnimation(newState);
    }
  }
  /**
   * Processa os inputs do jogador
   */
  handleInput() {
    this.inputController.update();

    let moving = false;

    if (this.inputController.pressed(Pads.RIGHT)) {
      this.movement.moveRight();
      moving = true;
    } else if (this.inputController.pressed(Pads.LEFT)) {
      this.movement.moveLeft();
      moving = true;
    }

    if (!moving) {
      this.movement.stopHorizontalMovement();
    }

    if (this.inputController.pressed(Pads.UP)) {
      this.movement.jump();
    }
  }
  /**
   * Atualiza o jogador
   */
  update() {
    this.handleInput();

    this.movement.update();

    this.updateAnimation();
  }
  /**
   * Renderiza o jogador na tela
   */
  draw() {
    const { frameWidth, frameHeight, image } =
      this.animationManager.getCurrentAnimation();
    const frameX = this.animationManager.getCurrentFrame() * frameWidth;
    const position = this.movement.getPosition();

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
