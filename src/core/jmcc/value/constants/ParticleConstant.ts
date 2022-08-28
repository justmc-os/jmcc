import { CValue } from '../Value';

class ParticleConstant extends CValue('particle', 'частица') {
  constructor(
    public particle: string,
    public count: number,
    public spread: {
      x: number;
      y: number;
    },
    public motion: {
      x: number;
      y: number;
      z: number;
    },
    public material?: string,
    public color?: string,
    public size?: number
  ) {
    super();
  }

  toString(): string {
    return `Particle(${this.particle}, ${this.count}, ${JSON.stringify(
      this.spread
    )}, ${JSON.stringify(this.motion)}, ${this.material}, ${this.size})`;
  }

  toJson(): object {
    const additional = {
      ...(this.material ? { material: this.material } : {}),
      ...(this.color ? { color: this.color } : {}),
      ...(this.size ? { size: this.size } : {}),
    };

    return {
      ...super.toJson(),
      particle_type: this.particle,
      count: this.count,
      first_spread: this.spread.x,
      second_spread: this.spread.y,
      x_motion: this.motion.x,
      y_motion: this.motion.y,
      z_motion: this.motion.z,
      ...additional,
    };
  }
}

export default ParticleConstant;
