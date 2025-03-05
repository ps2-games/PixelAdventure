/**
 * Caminho para a pasta de assets do projeto.
 * @constant {string}
 */
const PATH_TO_ASSETS = './src/assets/';

/**
 * Classe responsável por lidar com animações baseadas em spritesheets.
 */
export default class Animation {
  /**
   * Cria uma nova instância de Animation.
   * @param {string} spritesheetPath - O caminho do spritesheet dentro da pasta de assets.
   * @param {number} totalFrames - O número total de frames na animação.
   * @param {number} animationSpeed - A velocidade da animação (frames por segundo).
   * @param {number} frameWidth - A largura de cada frame no spritesheet.
   * @param {number} frameHeight - A altura de cada frame no spritesheet.
   * @param {boolean} loop - Define se a animação será repetida em loop.
   */
  constructor(spritesheetPath, totalFrames, animationSpeed, frameWidth, frameHeight, loop) {
    this.totalFrames = totalFrames;
    this.animationSpeed = animationSpeed;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.loop = loop;
    this.image = new Image(PATH_TO_ASSETS + spritesheetPath);
  }
}
