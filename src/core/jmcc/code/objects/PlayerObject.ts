import NamedObject from './NamedObject';
import playerActions from '../action/defined/PlayerActions';
import { dummyProperties } from '../properties/Properties';

class PlayerObject extends NamedObject {
  public readonly actions = playerActions;
  public readonly properties = dummyProperties;

  constructor() {
    super('player');
  }
}

const playerObject = new PlayerObject();

export default playerObject;
