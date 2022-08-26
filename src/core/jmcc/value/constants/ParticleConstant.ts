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
      spread: {
        first: this.spread.x,
        second: this.spread.y,
      },
      motion: this.motion,
      ...additional,
    };
  }
}

export default ParticleConstant;
