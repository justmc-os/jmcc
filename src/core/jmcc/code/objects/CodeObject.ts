import NamedObject from './NamedObject';
import { dummyProperties } from '../properties/Properties';
import codeActions from '../action/defined/CodeActions';

class CodeObject extends NamedObject {
  public readonly actions = codeActions;
  public readonly properties = dummyProperties;

  constructor() {
    super('code');
  }
}

const codeObject = new CodeObject();

export default codeObject;
