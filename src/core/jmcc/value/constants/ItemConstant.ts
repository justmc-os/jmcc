import { CValue } from '../Value';

class ItemConstant extends CValue('item', 'предмет') {
  constructor(public item: string) {
    super();
  }

  toString(): string {
    return this.item;
  }

  toJson(): object {
    return {
      ...super.toJson(),
      item: this.item,
    };
  }
}

export default ItemConstant;
