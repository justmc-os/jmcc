import TextConstant from '../../../value/constants/TextConstant';
import { ActionContainerType } from '../CodeContainingAction';
import Actions, { enumof } from './Actions';

const CODE_ACTIONS_SELECTION: string[] = [];

class CodeActions extends Actions {
  constructor() {
    super(CODE_ACTIONS_SELECTION);
  }

  BREAK = this.register('control_end_thread', 'break', {});

  ELSE = this.register(
    'else',
    'else',
    {},
    { containing: ActionContainerType.PREDICATE, predicate: false }
  );

  CALL_FUNCTION = this.register('call_function', 'call_function', {
    function_name: TextConstant,
  });

  START_PROCESS = this.register('start_process', 'start_process', {
    process_name: TextConstant,
    target_mode: enumof(
      'CURRENT_TARGET',
      'CURRENT_SELECTION',
      'NO_TARGET',
      'FOR_EACH_IN_SELECTION'
    ),
    local_variables_mode: enumof('DONT_COPY', 'COPY', 'SHARE'),
  });
}

const codeActions = new CodeActions();

export default codeActions;
