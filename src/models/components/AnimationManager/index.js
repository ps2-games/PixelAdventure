/**
 * Classe responsável por gerenciar animações.
 * Permite adicionar, alterar e atualizar animações, além de controlar o frame atual.
 */
export default class AnimationManager {
  /**
   * Cria uma instância do AnimationManager.
   * @param {Object.<string, Animation>} animations - Um objeto contendo as animações disponíveis, onde a chave é o nome da animação e o valor é uma instância de `Animation`.
   */
  constructor(animations) {
    /**
     * Objeto que armazena todas as animações disponíveis.
     * @type {Object.<string, Animation>}
     */
    this.animations = animations;

    /**
     * Animação atualmente em execução.
     * @type {Animation|null}
     */
    this.currentAnimation = null;

    /**
     * Frame atual da animação.
     * @type {number}
     */
    this.currentFrame = 0;

    /**
     * Timestamp da última atualização da animação.
     * @type {number}
     */
    this.lastUpdate = Date.now();

    const firstAnimationKey = Object.keys(animations)[0];
    if (firstAnimationKey) {
      this.setAnimation(firstAnimationKey);
    }
  }

  /**
   * Define a animação atual.
   * @param {string} name - Nome da animação a ser definida.
   */
  setAnimation(name) {
    if (this.animations[name] && this.currentAnimation !== this.animations[name]) {
      this.currentAnimation = this.animations[name];
      this.currentFrame = 0;
    }
  }

  /**
   * Atualiza o frame atual da animação com base no tempo decorrido.
   * Se a animação não for loop e chegar ao último frame, ela volta ao primeiro frame.
   */
  updateAnimation() {
    if (!this.currentAnimation) return;
  
    if (this.isAnimationFinished()) {
      return;
    }
  
    const now = Date.now();
    if (now - this.lastUpdate > this.currentAnimation.animationSpeed) {
      this.currentFrame++;
  
      if (this.currentFrame >= this.currentAnimation.totalFrames) {
        if (this.currentAnimation.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = this.currentAnimation.totalFrames - 1;
          this.markAnimationAsFinished();
        }
      }
  
      this.lastUpdate = now;
    }
  }
  
  /**
   * Verifica se a animação não-loop chegou ao fim.
   * @returns {boolean}
   */
  isAnimationFinished() {
    return (
      !this.currentAnimation.loop &&
      this.currentFrame === this.currentAnimation.totalFrames - 1
    );
  }
  
  /**
   * Marca a animação como concluída e executa o callback (se existir).
   */
  markAnimationAsFinished() {
    if (this.currentAnimation.onAnimationEnd) {
      this.currentAnimation.onAnimationEnd();
    }
  }

  /**
   * Retorna o frame atual da animação.
   * @returns {number} O índice do frame atual.
   */
  getCurrentFrame() {
    return this.currentFrame;
  }

  /**
   * Retorna a animação atualmente em execução.
   * @returns {Animation|null} A animação atual ou `null` se nenhuma animação estiver definida.
   */
  getCurrentAnimation() {
    return this.currentAnimation;
  }
}