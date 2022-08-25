import { data } from '../../..';
import { TracedParsingError } from '../../ErrorTraceable';
import Factory, { FactoryArguments, required } from './Factory';
import PotionConstant from '../../value/constants/PotionConstant';
import { number, text } from '../action/defined/Actions';

class PotionFactory extends Factory('potion') {
  static args = {
    potion: required(text),
    amplifier: number,
    duration: number,
  };

  create(args: FactoryArguments<typeof PotionFactory>): PotionConstant {
    const potion = args.potion.text;
    if (
      /[A-Z]/.test(potion) ||
      !Object.keys(data.effectsByName).includes(
        PotionFactory.toPascalCase(potion)
      )
    )
      throw new TracedParsingError(
        args.potion,
        `Неизвестное зелье '${potion}'`
      );

    const amplifier = args.amplifier?.number || 0;
    const duration = args.duration?.number || 2147483647;

    return new PotionConstant(potion, amplifier, duration);
  }

  static toPascalCase(snakeCase: string) {
    return snakeCase
      .split('_')
      .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1))
      .join('');
  }
}

const potionFactory = new PotionFactory();

export default potionFactory;
