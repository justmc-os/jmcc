import { CValue } from '../Value';

class VectorConstant extends CValue('vector', 'вектор') {
  constructor(public x: number, public y: number, public z: number) {
    super();
  }

  toString(): string {
    return `Vector(${this.x}, ${this.y}, ${this.z})`;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }
}

export default VectorConstant;
