import Factory, { FactoryArguments, required } from './Factory';
import SoundConstant from '../../value/constants/SoundConstant';
import { number, text } from '../action/defined/Actions';

class SoundFactory extends Factory('sound') {
  static args = {
    sound: required(text),
    volume: number,
    pitch: number,
  };

  create(args: FactoryArguments<typeof SoundFactory>): SoundConstant {
    const sound = args.sound.text;
    const volume = args.volume?.number || 1;
    const pitch = args.pitch?.number || 1;

    return new SoundConstant(sound, volume, pitch);
  }
}

const soundFactory = new SoundFactory();

export default soundFactory;
