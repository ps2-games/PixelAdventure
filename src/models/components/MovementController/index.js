/**
 * Classe responsável por controlar o movimento de uma entidade no jogo
 */
export default class MovementController {
  /**
   * @param {Object} options - Opções de configuração do movimento
   * @param {number} options.gravity - Força da gravidade
   * @param {number} options.jumpStrength - Força do pulo
   * @param {number} options.speed - Velocidade horizontal
   * @param {boolean} options.affectedByGravity - Se a entidade é afetada pela gravidade
   * @param {number} options.maxVelocityY - Velocidade vertical máxima
   * @param {Function} options.onJump - Callback quando a entidade pula
   * @param {Function} options.onLand - Callback quando a entidade pousa
   */
  constructor(options = {}) {
    this.position = {
      x: options.initialX || 0,
      y: options.initialY || 0
    };

    this.velocity = {
      x: 0,
      y: 0
    };

    this.physics = {
      gravity: options.gravity !== undefined ? options.gravity : 0.5,
      jumpStrength: options.jumpStrength !== undefined ? options.jumpStrength : -8,
      speed: options.speed !== undefined ? options.speed : 3,
      maxVelocityY: options.maxVelocityY !== undefined ? options.maxVelocityY : 10
    };

    this.constraints = {
      minX: options.minX,
      maxX: options.maxX,
      minY: options.minY,
      maxY: options.maxY
    };

    this.state = {
      isJumping: false,
      facingDirection: 'RIGHT',
      isGrounded: false,
      affectedByGravity: options.affectedByGravity !== undefined ? options.affectedByGravity : true,
      jumpsRemaining: 2,
      maxJumps: 2,
    };

    this.callbacks = {
      onJump: options.onJump,
      onDoubleJump: options.onDoubleJump,
      onLand: options.onLand,
      onDirectionChange: options.onDirectionChange,
      onMove: options.onMove
    };
  }

  /**
   * Atualiza a física da entidade
   * @param {number} deltaTime - Tempo decorrido desde o último frame
   */
  update(deltaTime = 1) {
    if (this.state.affectedByGravity) {
      this.applyGravity(deltaTime);
    }

    this.updatePosition(deltaTime);

    this.checkBoundaryCollisions();
  }

  /**
   * Aplica a força da gravidade
   * @param {number} deltaTime - Tempo decorrido desde o último frame
   */
  applyGravity(deltaTime) {
    if (this.velocity.y < this.physics.maxVelocityY) {
      this.velocity.y += this.physics.gravity * deltaTime;
    }
  }

  /**
   * Atualiza a posição com base na velocidade
   * @param {number} deltaTime - Tempo decorrido desde o último frame
   */
  updatePosition(deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    if (this.callbacks.onMove) {
      this.callbacks.onMove(this.position.x, this.position.y);
    }
  }

  /**
   * Verifica colisões com os limites definidos
   */
  checkBoundaryCollisions() {
    const wasGrounded = this.state.isGrounded;

    if (this.constraints.minX !== undefined && this.position.x < this.constraints.minX) {
      this.position.x = this.constraints.minX;
      this.velocity.x = 0;
    }

    if (this.constraints.maxX !== undefined && this.position.x > this.constraints.maxX) {
      this.position.x = this.constraints.maxX;
      this.velocity.x = 0;
    }

    if (this.constraints.minY !== undefined && this.position.y < this.constraints.minY) {
      this.position.y = this.constraints.minY;
      this.velocity.y = 0;
    }

    if (this.constraints.maxY !== undefined && this.position.y > this.constraints.maxY) {
      this.position.y = this.constraints.maxY;
      this.velocity.y = 0;
      this.state.isJumping = false;
      this.state.isGrounded = true;
      this.state.jumpsRemaining = this.state.maxJumps;

      if (!wasGrounded && this.callbacks.onLand) {
        this.callbacks.onLand();
      }
    } else if (this.constraints.maxY !== undefined) {
      this.state.isGrounded = false;
    }
  }

  /**
   * Move a entidade para a direita
   * @param {number} multiplier - Multiplicador de velocidade opcional
   */
  moveRight(multiplier = 1) {
    const prevDirection = this.state.facingDirection;
    this.velocity.x = this.physics.speed * multiplier;
    this.state.facingDirection = 'RIGHT';

    if (prevDirection !== this.state.facingDirection && this.callbacks.onDirectionChange) {
      this.callbacks.onDirectionChange(this.state.facingDirection);
    }
  }

  /**
   * Move a entidade para a esquerda
   * @param {number} multiplier - Multiplicador de velocidade opcional
   */
  moveLeft(multiplier = 1) {
    const prevDirection = this.state.facingDirection;
    this.velocity.x = -this.physics.speed * multiplier;
    this.state.facingDirection = 'LEFT';

    if (prevDirection !== this.state.facingDirection && this.callbacks.onDirectionChange) {
      this.callbacks.onDirectionChange(this.state.facingDirection);
    }
  }

  /**
   * Para o movimento horizontal
   */
  stopHorizontalMovement() {
    this.velocity.x = 0;
  }

  /**
   * Faz a entidade pular
   * @param {number} multiplier - Multiplicador de força opcional
   * @returns {boolean} - Se o pulo foi executado com sucesso
   */
  jump(multiplier = 1) {
    if (this.state.isGrounded || this.state.jumpsRemaining > 0) {
      this.velocity.y = this.physics.jumpStrength * multiplier;
      this.state.isJumping = true;
      this.state.isGrounded = false;

      if (!this.state.isGrounded && this.state.jumpsRemaining === 1 && this.callbacks.onDoubleJump) {
        this.callbacks.onDoubleJump();
      }

      else if (this.callbacks.onJump) {
        this.callbacks.onJump();
      }

      this.state.jumpsRemaining--;

      return true;
    }
    return false;
  }

  /**
   * Configura a posição da entidade
   * @param {number} x - Nova posição X
   * @param {number} y - Nova posição Y
   */
  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  /**
   * Configura a velocidade da entidade
   * @param {number} x - Nova velocidade X
   * @param {number} y - Nova velocidade Y
   */
  setVelocity(x, y) {
    this.velocity.x = x;
    this.velocity.y = y;
  }

  /**
   * Configura os limites de movimento
   * @param {Object} constraints - Limites de movimento
   */
  setConstraints(constraints) {
    this.constraints = {
      ...this.constraints,
      ...constraints
    };
  }

  /**
   * Retorna a posição atual
   * @returns {Object} Objeto contendo as coordenadas x e y
   */
  getPosition() {
    return { ...this.position };
  }

  /**
   * Retorna a velocidade atual
   * @returns {Object} Objeto contendo as componentes de velocidade x e y
   */
  getVelocity() {
    return { ...this.velocity };
  }

  /**
   * Retorna a direção que a entidade está olhando
   * @returns {string} Direção ('LEFT' ou 'RIGHT')
   */
  getFacingDirection() {
    return this.state.facingDirection;
  }

  /**
   * Verifica se a entidade está no chão
   * @returns {boolean} Verdadeiro se estiver no chão
   */
  isGrounded() {
    return this.state.isGrounded;
  }

  /**
   * Verifica se a entidade está pulando
   * @returns {boolean} Verdadeiro se estiver pulando
   */
  isJumping() {
    return this.state.isJumping;
  }
}