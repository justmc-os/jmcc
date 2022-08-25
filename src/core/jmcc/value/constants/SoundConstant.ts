import { CValue } from '../Value';

class SoundConstant extends CValue('sound', 'звук') {
  constructor(
    public sound: string,
    public volume: number,
    public pitch: number
  ) {
    super();
  }

  toString(): string {
    return `Sound(${this.sound}, ${this.volume}, ${this.pitch})`;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      sound: this.sound,
      volume: this.volume,
      pitch: this.pitch,
    };
  }
}

export default SoundConstant;
