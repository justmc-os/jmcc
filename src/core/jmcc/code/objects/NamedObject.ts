import Actions from '../action/defined/Actions';
import Properties from '../properties/Properties';

abstract class NamedObject {
  abstract actions: Actions;
  abstract properties: Properties;

  constructor(public name: string) {}
}

export default NamedObject;
