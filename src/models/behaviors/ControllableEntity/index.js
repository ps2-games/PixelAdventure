import MovableEntity from "../MovableEntity/index.js";

export default class ControllableEntity extends MovableEntity {
  constructor(x = 0, y = 0, movementOptions = {}, inputController = null) {
    super(x, y, movementOptions);
    this.inputController = inputController;
  }
  
  setInputController(controller) {
    this.inputController = controller;
  }

  handleInput() {
    throw new Error("O método 'handleInput' deve ser implementado na subclasse.");
  }
  

  update() {
    this.handleInput(this.inputController);
    super.update();
  }
  
}