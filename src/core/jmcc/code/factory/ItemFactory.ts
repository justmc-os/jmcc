import { MinecraftText } from '@rqbik/mtext';

import { data } from '../../..';
import Factory, { FactoryArguments, required } from './Factory';
import ItemConstant from '../../value/constants/ItemConstant';
import { array, number, text } from '../action/defined/Actions';
import { TracedParsingError } from '../../ErrorTraceable';

class ItemFactory extends Factory('item') {
  static args = {
    id: required(text),
    name: text,
    count: number,
    lore: array(text, 20),
    nbt: text,
  };

  create(args: FactoryArguments<typeof ItemFactory>): ItemConstant {
    let item: { [key: string]: any } = {};

    const id = args.id.text;
    if (
      !Object.keys(data.itemsByName).includes(id) &&
      !Object.keys(data.blocksByName).includes(id)
    )
      throw new TracedParsingError(args.id, `Неизвестный предмет '${id}'`);

    item.id = id;

    if (args.name)
      item.tag = {
        display: {
          Name: MinecraftText.from(args.name.text).toJsonString(),
        },
      };

    item.Count = args.count?.number || 1;

    if (args.lore) {
      if (!('tag' in item)) item.tag = { display: {} };
      item.tag.display.Lore = [];

      args.lore.values.forEach((value) => {
        item.tag.display.Lore.push(MinecraftText.from(value.text).toJsonString());
      });
    }

    if (args.nbt) {
      let nbt: object;
      try {
        nbt = JSON.parse(args.nbt.text);
      } catch (e) {
        throw new TracedParsingError(args.nbt, `Неправильный JSON объект`);
      }

      item = { ...item, tag: { ...item.tag, ...nbt } };
    }

    return new ItemConstant(JSON.stringify(item));
  }
}

const itemFactory = new ItemFactory();

export default itemFactory;
