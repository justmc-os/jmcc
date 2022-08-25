import NamedObject from './NamedObject';
import { dummyActions } from '../action/defined/Actions';
import gameValues from '../properties/GameValues';

class ValueObject extends NamedObject {
  public readonly actions = dummyActions;
  public readonly properties = gameValues;

  constructor() {
    super('value');
  }
}

const valueObject = new ValueObject();

export default valueObject;
