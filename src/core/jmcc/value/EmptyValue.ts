import CValue from './Value';

class EmptyValue extends CValue('empty', 'пустое значение') {
  toJson(): object {
    return {};
  }
}

export default EmptyValue;