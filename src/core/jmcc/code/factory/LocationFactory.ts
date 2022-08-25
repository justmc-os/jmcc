import Factory, { FactoryArguments, required } from './Factory';
import { number } from '../action/defined/Actions';
import LocationConstant from '../../value/constants/LocationConstant';

class LocationFactory extends Factory('location') {
  static DEFAULT_YAW = 90;
  static DEFAULT_PITCH = 0;
  static args = {
    x: required(number),
    y: required(number),
    z: required(number),
    yaw: number,
    pitch: number,
  };

  create(args: FactoryArguments<typeof LocationFactory>): LocationConstant {
    const yaw = args.yaw ? args.yaw.number : LocationFactory.DEFAULT_YAW;
    const pitch = args.pitch
      ? args.pitch.number
      : LocationFactory.DEFAULT_PITCH;

    return new LocationConstant(
      args.x.number,
      args.y.number,
      args.z.number,
      yaw,
      pitch
    );
  }
}

const locationFactory = new LocationFactory();

export default locationFactory;
