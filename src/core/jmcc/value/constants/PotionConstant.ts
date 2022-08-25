import { CValue } from '../Value';

class PotionConstant extends CValue('potion', 'зелье') {
  constructor(
    public potion: string,
    public amplifier: number,
    public duration: number
  ) {
    super();
  }

  toString(): string {
    return `Potion(${this.potion}, ${this.amplifier}, ${this.duration})`;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      potion: this.potion,
      amplifier: this.amplifier,
      duration: this.duration,
    };
  }
}

export default PotionConstant;
