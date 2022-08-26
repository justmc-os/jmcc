import Actions, { any, array, number, variable, enumof } from './Actions';

const VARIABLE_ACTIONS_SELECTION: string[] = [];

class VariableActions extends Actions {
  constructor() {
    super(VARIABLE_ACTIONS_SELECTION);
  }

  // #region Setting
  SET = this.register(
    'set_variable_value',
    'set_value',
    {
      variable,
      value: any,
    },
    { assigning: 'variable' }
  );
  // #endregion

  // #region Numerical
  INCREMENT = this.register(
    'set_variable_increment',
    'increment',
    {
      variable,
      number,
    },
    { origin: 'variable' }
  );

  DECREMENT = this.register(
    'set_variable_decrement',
    'decrement',
    {
      variable,
      number,
    },
    { origin: 'variable' }
  );

  MULTIPLY = this.register(
    'set_variable_multiply',
    'multiply',
    {
      variable: variable,
      value: array(number, 21),
    },
    { assigning: 'variable' }
  );

  DIVIDE = this.register(
    'set_variable_divide',
    'multiply',
    {
      variable: variable,
      value: array(number, 21),
      division_mode: enumof('DEFAULT', 'ROUND_TO_INT'),
    },
    { assigning: 'variable' }
  );

  REMAINDER = this.register(
    'set_variable_remainder',
    'remainder',
    {
      variable: variable,
      dividend: number,
      divisor: number,
    },
    { assigning: 'variable' }
  );
  // #endregion

  // #region Lists
  CREATE_LIST = this.register(
    'set_variable_create_list',
    'create_list',
    {
      variable,
      values: array(any, 21),
    },
    { assigning: 'variable' }
  );

  CREATE_MAP = this.register(
    'set_variable_create_map',
    'create_map',
    {
      variable,
      keys: variable,
      values: variable,
    },
    { assigning: 'variable' }
  );

  LIST_GET = this.register(
    'set_variable_get_list_value',
    'get_at',
    {
      variable,
      list: variable,
      number: number,
    },
    { assigning: 'variable', origin: 'list' }
  );

  APPEND_VALUES = this.register(
    'set_variable_append_value',
    'append_values',
    {
      variable,
      values: array(any, 21),
    },
    { origin: 'variable' }
  );

  SET_AT = this.register(
    'set_variable_set_list_value',
    'set_at',
    {
      variable: variable,
      list: variable,
      number,
      value: any,
    },
    { assigning: 'variable', origin: 'list' }
  );
  // #endregion
}

const variableActions = new VariableActions();

export default variableActions;
