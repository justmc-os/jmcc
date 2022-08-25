import CodeAction, { CodeActionArguments } from './CodeAction';

class CodeAssigningAction extends CodeAction {
  constructor(
    action: string,
    public assigning: string,
    args: CodeActionArguments = {},
    origin?: string,
    selection: string | null = null
  ) {
    super(action, args, origin, selection);
  }
}

export default CodeAssigningAction;
