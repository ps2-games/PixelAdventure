import Animation from "../Animation/index.js";
import AnimationManager from "../AnimationManager/index.js";
import { MovementController } from "../Movement/index.js";
import { PlayerMovementConstants } from "./constants/movement.js";
import { PlayerAnimationsStates } from "./state/animations.js";

export default class Player {
  /**
   * @param {number} canvasWidth - Largura do canvas do jogo
   * @param {number} canvasHeight - Altura do canvas do jogo
   * @param {object} options - Opções de configuração do jogador
   */
  constructor(canvasWidth, canvasHeight, options = {}) {
    this.initializeAnimations();
    
    this.inputController = Pads.get();
    
    const spriteHeight = this.animationManager.getCurrentAnimation().frameHeight;
    const groundLevel = canvasHeight - spriteHeight;
    
    this.movement = new MovementController({
      initialX: 0,
      initialY: groundLevel,
      gravity: options.gravity || PlayerMovementConstants.DEFAULT_GRAVITY,
      jumpStrength: options.jumpStrength || PlayerMovementConstants.DEFAULT_JUMP_STRENGTH,
      speed: options.speed || PlayerMovementConstants.DEFAULT_SPEED,
      minX: 0,
      maxX: canvasWidth - this.animationManager.getCurrentAnimation().frameWidth,
      maxY: groundLevel,
      onJump: () => {
        this.animationManager.setAnimation(PlayerAnimationsStates.JUMP);
      },
      onLand: () => {
        if (this.movement.getVelocity().x !== 0) {
          this.animationManager.setAnimation(PlayerAnimationsStates.RUN);
        } else {
          this.animationManager.setAnimation(PlayerAnimationsStates.IDLE);
        }
      },
      onDirectionChange: (direction) => {
        this.flipX = direction === PlayerMovementConstants.DIRECTION.LEFT;
      }
    });
  }
  /**
   * Inicializa todas as animações do jogador
   */
  initializeAnimations() {
    const animations = {
      [PlayerAnimationsStates.IDLE]: new Animation("Sheets/ninjaFrog/Idle.png", 11, 100, 32, 32, true),
      [PlayerAnimationsStates.RUN]: new Animation("Sheets/ninjaFrog/Run.png", 12, 50, 32, 32, true),
      [PlayerAnimationsStates.JUMP]: new Animation("Sheets/ninjaFrog/Jump.png", 1, 100, 32, 32, false),
      [PlayerAnimationsStates.FALL]: new Animation("Sheets/ninjaFrog/Fall.png", 1, 100, 32, 32, false)
    };
    
    this.animationManager = new AnimationManager(animations);
    this.flipX = false;
  }
  /**
   * Atualiza o estado da animação baseado no estado do jogador
   */
  updateAnimation() {
    this.animationManager.updateAnimation();
    
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
      this.animationManager.setAnimation(newState);
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
    const currentAnimation = this.animationManager.getCurrentAnimation();
    const frameWidth = currentAnimation.frameWidth;
    const frameHeight = currentAnimation.frameHeight;
    const currentFrame = this.animationManager.getCurrentFrame();
    const image = currentAnimation.image;
    const position = this.movement.getPosition();
    
    image.startx = currentFrame * frameWidth;
    image.starty = 0;
    image.endx = image.startx + frameWidth;
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