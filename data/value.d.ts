export type ValueData = {
  id: string;
  name: string;
  type: string;
  array?: {
    length: number;
    type: string;
  };
  map?: {
    key: string;
    value: string;
  };
};
