import Properties from './Properties';
import selection from '../Selection';

const GAME_VALUES_SELECTION = [
  selection.CURRENT,
  selection.DEFAULT,
  selection.DEFAULT_ENTITY,
  selection.KILLER_ENTITY,
  selection.DAMAGER_ENTITY,
  selection.VICTIM_ENTITY,
  selection.SHOOTER_ENTITY,
  selection.PROJECTILE,
  selection.LAST_ENTITY,
];

class GameValues extends Properties {
  constructor() {
    super(GAME_VALUES_SELECTION);
  }
}

const gameValues = new GameValues();

export default gameValues;
