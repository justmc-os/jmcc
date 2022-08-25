import chalk from 'chalk';

import Any from './Any';
import ErrorTraceable from '../ErrorTraceable';
import EnumConstant, { BooleanConstant } from './constants/EnumConstant';
import ItemConstant from './constants/ItemConstant';
import LocationConstant from './constants/LocationConstant';
import NumberConstant from './constants/NumberConstant';
import ParticleConstant from './constants/ParticleConstant';
import PotionConstant from './constants/PotionConstant';
import SoundConstant from './constants/SoundConstant';
import TextConstant from './constants/TextConstant';
import VectorConstant from './constants/VectorConstant';
import MathExpression from './MathExpression';
import Variable from './Variable';

export type ValueType =
  | typeof NumberConstant
  | typeof TextConstant
  | typeof LocationConstant
  | typeof VectorConstant
  | typeof ItemConstant
  | typeof EnumConstant
  | typeof BooleanConstant
  | typeof ParticleConstant
  | typeof PotionConstant
  | typeof SoundConstant
  | typeof Variable
  | typeof MathExpression
  | typeof Any;

export abstract class Value extends ErrorTraceable {
  static type: string;
  static text: string;

  get ctor() {
    return this.constructor as ValueType;
  }

  abstract toString(): string;
  abstract toJson(): object;
  abstract toDebug(): string;
}

export const CValue = (type: string, text: string) => {
  return class extends Value {
    static type: string = type;
    static text: string = text;

    toString(): string {
      throw new Error('Method not implemented.');
    }

    toJson(): object {
      return {
        type: this.ctor.type,
      };
    }

    toDebug(): string {
      return chalk.cyan(this.ctor.text);
    }
  };
};

export default CValue;
