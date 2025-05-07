export default class Entity {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.debugColor = Color.new(255, 0, 0, 50);

    this._bounds = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
  }

  getBounds() {
    this._bounds.left = this.x;
    this._bounds.top = this.y;
    this._bounds.right = this.x + this.width;
    this._bounds.bottom = this.y + this.height;

    return this._bounds;
  }

  isColliding(otherEntity) {
    const a = this.getBounds();
    const b = otherEntity.getBounds();

    return !(
      a.left >= b.right ||
      a.right <= b.left ||
      a.top >= b.bottom ||
      a.bottom <= b.top
    );
  }

  update() {
    throw new Error("O método 'update' deve ser implementado na subclasse.");
  }

  draw() {
    throw new Error("O método 'draw' deve ser implementado na subclasse.");
  }

  drawCollisionBox(x = this.x, y = this.y) {
    this.getBounds()
    const bounds = (x === this.x && y === this.y) ?
      this._bounds :
      { left: x, top: y, right: x + this.width, bottom: y + this.height };

    Draw.quad(
      bounds.left, bounds.top,
      bounds.right, bounds.top,
      bounds.right, bounds.bottom,
      bounds.left, bounds.bottom,
      this.debugColor
    );
  }
}