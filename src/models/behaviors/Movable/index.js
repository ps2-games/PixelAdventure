import MovementController from "../../components/MovementController/index.js";

export default class Movable {
  constructor(x = 0, y = 0, movementOptions = {}) {
    this._x = x;
    this._y = y;
    this.movement =
      Object.keys(movementOptions).length > 0
        ? new MovementController({
            ...movementOptions,
            initialX: x,
            initialY: y,
          })
        : null;
  }

  initializeMovement(options) {
    this.movement = new MovementController({
      ...options,
      initialX: this._x,
      initialY: this._y,
    });
  }

  get x() {
    return this.movement ? this.movement.getPosition().x : this._x;
  }

  set x(value) {
    if (this.movement) {
      const position = this.movement.getPosition();
      this.movement.setPosition(value, position.y);
    } else {
      this._x = value;
    }
  }

  get y() {
    return this.movement ? this.movement.getPosition().y : this._y;
  }

  set y(value) {
    if (this.movement) {
      const position = this.movement.getPosition();
      this.movement.setPosition(position.x, value);
    } else {
      this._y = value;
    }
  }

  update() {
    if (this.movement) {
      this.movement.update();
    }
  }
}