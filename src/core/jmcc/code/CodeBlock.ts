abstract class CodeBlock {
  abstract readonly length: number;

  abstract toJson(): object;
}

export default CodeBlock;
