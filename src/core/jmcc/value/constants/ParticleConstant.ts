import { CValue } from '../Value';

class ParticleConstant extends CValue('particle', 'частица') {
  static type: string = 'частица';

  constructor(
    public particle: string,
    public count: number,
    public offset: {
      x: number;
      y: number;
      z: number;
    },
    public velocity: {
      x: number;
      y: number;
      z: number;
    },
    public material?: string,
    public size?: number
  ) {
    super();
  }

  toString(): string {
    return `Particle(${this.particle}, ${this.count}, ${JSON.stringify(
      this.offset
    )}, ${JSON.stringify(this.velocity)}, ${this.material}, ${this.size})`;
  }

  toJson(): object {
    const additional = {
      ...(this.material ? { material: this.material } : {}),
      ...(this.size ? { size: this.size } : {}),
    };

    return {
      ...super.toJson(),
      particle_type: this.particle,
      count: this.count,
      x_offset: this.offset.x,
      y_offset: this.offset.y,
      z_offset: this.offset.z,
      x_velocity: this.velocity.x,
      y_velocity: this.velocity.y,
      z_velocity: this.velocity.z,
      ...additional,
    };
  }
}

export default ParticleConstant;
