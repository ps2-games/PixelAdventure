import TileProperties from "../../../@types/tile-properties.js";
import TileTypes from "../../../@types/tile-types.js";

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
      isWallSliding: false
    };

    this.callbacks = {
      onJump: options.onJump,
      onDoubleJump: options.onDoubleJump,
      onLand: options.onLand,
      onDirectionChange: options.onDirectionChange,
      onMove: options.onMove
    };

    this.tileMap = options.tileMap || [];
    this.entity = options.entity;
  }

  checkWallCollision() {
    const collisionDistance = 5;
    const direction = this.state.facingDirection;
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

  checkTileCollision(newX, newY, direction) {
    const bounds = {
      left: newX,
      right: newX + this.entity.width,
      top: newY,
      bottom: newY + this.entity.height
    };

    let closestCollision = null;
    let minDistance = Infinity;

    const nearbyTiles = this.tileMap.filter(tile => {
      return (
        Math.abs(tile.x - newX) < 100 &&
        Math.abs(tile.y - newY) < 100
      );
    });

    for (const tile of nearbyTiles) {
      const tileProps = TileProperties[tile.type] || TileProperties[TileTypes.DECORATION];
      if (!tileProps.collidable) continue;

      const tileBounds = {
        left: tile.x,
        right: tile.x + tile.width,
        top: tile.y,
        bottom: tile.y + tile.height,
      };

      if (
        bounds.left < tileBounds.right &&
        bounds.right > tileBounds.left &&
        bounds.top < tileBounds.bottom &&
        bounds.bottom > tileBounds.top
      ) {
        if (tileProps.isPlatform) {
          if (this.velocity.y > 0) {
            const steps = Math.max(1, Math.ceil(Math.abs(this.velocity.y * 2)));
            for (let i = 0; i <= steps; i++) {
              const testY = this.position.y + (newY - this.position.y) * (i / steps);
              const testBounds = {
                ...bounds,
                top: testY,
                bottom: testY + this.entity.height
              };

              if (
                testBounds.bottom >= tileBounds.top &&
                testBounds.bottom <= tileBounds.top + 10 &&
                testBounds.right > tileBounds.left + 5 &&
                testBounds.left < tileBounds.right - 5
              ) {
                return { tile, tileProps };
              }
            }
          }
          continue;
        }

        let distance;
        if (direction === 'horizontal') {
          distance = Math.min(
            Math.abs(bounds.right - tileBounds.left),
            Math.abs(tileBounds.right - bounds.left)
          );
        } else {
          distance = Math.min(
            Math.abs(bounds.bottom - tileBounds.top),
            Math.abs(tileBounds.bottom - bounds.top)
          );
        }

        if (distance < minDistance) {
          minDistance = distance;
          closestCollision = { tile, tileProps };
        }
      }
    }
    return closestCollision;
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
   * Atualiza a posição com base na velocidade, considerando colisões com tiles
   * @param {number} deltaTime - Tempo decorrido desde o último frame
   */
  updatePosition(deltaTime) {
    const wasGrounded = this.state.isGrounded;

    let newX = this.position.x + this.velocity.x * deltaTime;
    let newY = this.position.y + this.velocity.y * deltaTime;

    if (this.velocity.y !== 0) {
      const vCollision = this.checkTileCollision(this.position.x, newY, 'vertical');
      if (vCollision) {
        if (vCollision.tileProps.isPlatform) {
          if (this.velocity.y > 0 && this.position.y + this.entity.height <= vCollision.tile.y) {
            newY = vCollision.tile.y - this.entity.height;
            this.velocity.y = 0;
            this.state.isGrounded = true;
            this.state.jumpsRemaining = this.state.maxJumps;
            if (!wasGrounded && this.callbacks.onLand) {
              this.callbacks.onLand();
            }
          }
        } else if (vCollision.tileProps.collidable) {
          if (this.velocity.y > 0) {
            newY = vCollision.tile.y - this.entity.height;
            this.velocity.y = 0;
            this.state.isGrounded = true;
            this.state.jumpsRemaining = this.state.maxJumps;
            if (!wasGrounded && this.callbacks.onLand) {
              this.callbacks.onLand();
            }
          } else if (this.velocity.y < 0) {
            newY = vCollision.tile.y + vCollision.tile.height;
            this.velocity.y = 0;
            this.state.isJumping = false;
          }
        }
      } else {
        this.state.isGrounded = false;
      }
    }

    if (this.velocity.x !== 0) {
      const hCollision = this.checkTileCollision(newX, this.position.y, 'horizontal');
      if (hCollision && hCollision.tileProps.collidable && !hCollision.tileProps.isPlatform) {
        if (this.velocity.x > 0) {
          newX = hCollision.tile.x - this.entity.width;
        } else if (this.velocity.x < 0) {
          newX = hCollision.tile.x + hCollision.tile.width;
        }
        this.velocity.x = 0;
      }
    }

    this.position.x = newX;
    this.position.y = newY;

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