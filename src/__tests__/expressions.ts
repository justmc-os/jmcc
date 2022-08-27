import JMCC from '../core';

const jmcc = new JMCC();

describe('выражения', () => {
  describe('математические', () => {
    test('мультипликативные', () => {
      const source = `
        var a = 2 * 2
        var b = 4 / 2
        var c = b % 3
        var chain = 1 * 2 / 3 % 4
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('аддитивные', () => {
      const source = `
        var a = 2 + 2
        var b = a - 2
        var chain = 1 + 2 - 3
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('со скобками', () => {
      const source = `
        var a = 2 + 2 * 2
        var b = (2 + 2) * 2
        var c = b / (1 + 3)
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });

    test('с динамическими значениями', () => {
      const source = `
        var a = 1.clamp(0, 2)
        var b = a + 1
      `;

      expect(jmcc.compileToJson(source)).toMatchSnapshot();
    });
  });

  test('устанавливающие', () => {
    const source = `
      var a = 0
      a = 1
      a += 1
      a -= 1
      a *= 1
      a /= 1
      a %= 1
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });

  test('унарные', () => {
    const source = `
      var a = 0
      a++
      a--
      ++a
      --a
    `;

    expect(jmcc.compileToJson(source)).toMatchSnapshot();
  });
});
