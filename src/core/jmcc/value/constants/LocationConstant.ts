import { CValue } from '../Value';

class LocationConstant extends CValue('location', 'местоположение') {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public yaw: number,
    public pitch: number
  ) {
    super();
  }

  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z}, ${this.yaw}, ${this.pitch})`;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      x: this.x,
      y: this.y,
      z: this.z,
      yaw: this.yaw,
      pitch: this.pitch,
    };
  }
}

export default LocationConstant;
