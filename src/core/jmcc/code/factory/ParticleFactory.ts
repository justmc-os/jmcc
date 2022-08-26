import { data } from '../../..';
import Factory, { FactoryArguments, required } from './Factory';
import { number, text } from '../action/defined/Actions';
import ParticleConstant from '../../value/constants/ParticleConstant';
import { TracedParsingError } from '../../ErrorTraceable';

class ParticleFactory extends Factory('particle') {
  static args = {
    particle: required(text),
    count: number,
    spread_x: number,
    spread_y: number,
    motion_x: number,
    motion_y: number,
    motion_z: number,
    material: text,
    color: text,
    size: number,
  };

  create(args: FactoryArguments<typeof ParticleFactory>): ParticleConstant {
    const particle = args.particle.text;
    if (!Object.keys(data.particlesByName).includes(particle))
      throw new TracedParsingError(
        args.particle,
        `Неизвестная частица '${particle}'`
      );

    const count = args.count?.number || 1;
    const spread = {
      x: args.spread_x?.number || 1,
      y: args.spread_y?.number || 1,
    };

    const motion = {
      x: args.motion_x?.number || 1,
      y: args.motion_y?.number || 1,
      z: args.motion_z?.number || 1,
    };

    return new ParticleConstant(
      particle,
      count,
      spread,
      motion,
      args.material?.text,
      args.color?.text,
      args.size?.number
    );
  }
}

const particleFactory = new ParticleFactory();

export default particleFactory;
