export default class Entity {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getBounds() {
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.width,
      bottom: this.y + this.height,
    };
  }

  isColliding(otherEntity) {
    const a = this.getBounds();
    const b = otherEntity.getBounds();

    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }

  update() {
    throw new Error("O método 'update' deve ser implementado na subclasse.");
  }

  draw() {
    throw new Error("O método 'draw' deve ser implementado na subclasse.");
  }
}