import Factory, { FactoryArguments, required } from './Factory';
import VectorConstant from '../../value/constants/VectorConstant';
import { number } from '../action/defined/Actions';

class VectorFactory extends Factory('vector') {
  static args = {
    x: required(number),
    y: required(number),
    z: required(number),
  };

  create(args: FactoryArguments<typeof VectorFactory>): VectorConstant {
    return new VectorConstant(args.x.number, args.y.number, args.z.number);
  }
}

const vectorFactory = new VectorFactory();

export default vectorFactory;
