export default class Entity {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  update() {
    throw new Error("O método 'update' deve ser implementado na subclasse.");
  }
  
  draw() {
    throw new Error("O método 'draw' deve ser implementado na subclasse.");
  }
  
}