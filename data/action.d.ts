export type IActionContainerType = 'base' | 'lambda' | 'predicate';

export type ActionData = {
  id: string;
  name: string;
  object: string;
  args: ActionDataArgument[];
  origin?: string;
  assigning?: string;
  containing?: IActionContainerType;
  lambda?: string[];
  conditional?: boolean;
};

export type ActionDataArgument = {
  type: string;
  name: string;
  array?: boolean;
  length?: number;
  enum?: string[];
  defaultBooleanValue?: boolean;
};
