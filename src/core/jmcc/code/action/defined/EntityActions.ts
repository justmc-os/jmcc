import Actions from './Actions';
import selection from '../../Selection';

const ENTITY_ACTIONS_SELECTION: string[] = [
  selection.CURRENT,
  selection.DEFAULT_ENTITY,
  selection.KILLER_ENTITY,
  selection.DAMAGER_ENTITY,
  selection.SHOOTER_ENTITY,
  selection.PROJECTILE,
  selection.VICTIM_ENTITY,
  selection.RANDOM_ENTITY,
  selection.ALL_MOBS,
  selection.ALL_ENTITIES,
  selection.LAST_ENTITY,
];

class EntityActions extends Actions {
  constructor() {
    super(ENTITY_ACTIONS_SELECTION);
  }
}

const entityActions = new EntityActions();

export default entityActions;
