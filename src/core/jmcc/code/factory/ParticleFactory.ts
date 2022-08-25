import { data } from '../../..';
import Factory, { FactoryArguments, required } from './Factory';
import { number, text } from '../action/defined/Actions';
import ParticleConstant from '../../value/constants/ParticleConstant';
import { TracedParsingError } from '../../ErrorTraceable';

class ParticleFactory extends Factory('particle') {
  static args = {
    particle: required(text),
    count: number,
    offset_x: number,
    offset_y: number,
    offset_z: number,
    velocity_x: number,
    velocity_y: number,
    velocity_z: number,
    material: text,
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
    const offset = {
      x: args.offset_x?.number || 1,
      y: args.offset_y?.number || 1,
      z: args.offset_z?.number || 1,
    };

    const velocity = {
      x: args.velocity_x?.number || 1,
      y: args.velocity_y?.number || 1,
      z: args.velocity_z?.number || 1,
    };

    return new ParticleConstant(
      particle,
      count,
      offset,
      velocity,
      args.material?.text,
      args.size?.number
    );
  }
}

const particleFactory = new ParticleFactory();

export default particleFactory;
