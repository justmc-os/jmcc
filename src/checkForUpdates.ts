import chalk from 'chalk';

import bootstrap from './core/jmcc/Bootstrap';
import localVersion from '../data/version.json';

type VersionFile = {
  data: number;
  compiler: number;
};

async function checkForUpdates() {
  let version: VersionFile;
  try {
    version = await bootstrap.getRemoteDataFile('version.json');
  } catch (e) {
    return;
  }

  const localDataVersion = bootstrap.getLocalDataVersion();

  if (version.data > localDataVersion) {
    console.log(
      chalk.bgYellow.black(' Внимание '),
      `Данные о коде отстают от нужных на ${chalk.red(
        version.data - localDataVersion
      )} версии. Обновитесь с помощью ${chalk.cyan('jmcc update')}`
    );
  }

  if (version.compiler > localVersion.compiler) {
    console.log(
      chalk.bgYellow.black(' Внимание '),
      `Компилятор отстаёт от нужного на ${chalk.red(
        version.compiler - localVersion.compiler
      )} версии. Обновитесь переустановив компилятор`
    );
  }
}

export default checkForUpdates;
